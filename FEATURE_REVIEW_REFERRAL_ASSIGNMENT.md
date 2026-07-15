# Feature Review: Referral Assignment & Dentist Response Flow

## Document Version
- **Date**: 2026-07-15
- **Status**: Ready for Implementation
- **Author**: OpenCode Investigation

---

## 1. Executive Summary

This document defines the complete technical review, architecture, and implementation plan for adding a **"Referral Assignment"** flow to the existing Aspire Clinix referral system.

### New Flow (High-Level)

1. **Referral Submitted** → `ReferralRequest` created with status `UNASSIGNED` (existing behavior).
2. **Admin** opens unassigned referral detail and clicks **"Assign Referral"**.
3. **Assign Dentist Modal** opens → lists Dentally practitioners → Admin clicks **Assign** or **Unassign**.
4. On assign → `assignedDentistId` is set → status becomes `PENDING_REVIEW`.
5. **Dentally Dentist** (`DENTALLY_PRACTITIONER`) sees this referral in their **Referral Request** page.
6. Dentist opens detail → reviews → can **Accept** or **Reject**, and add:
   - Comments on the referral
   - Proposed treatment / consultation details
   - Availability / proposed time
7. **Admin** views the same detail page and sees all dentist responses (read-only for admin regarding dentist inputs).
8. Admin uses the dentist's proposed availability to book an appointment in **Dentally** directly.
9. Admin returns to the referral detail and clicks **"Bind Appointment"** → binds the newly booked Dentally appointment.
10. Status becomes `ASSIGNED` → existing post-assignment flow continues unchanged.

### Old Flow That Must Remain

The existing "Bind Appointment" flow (admin binds directly without prior dentist assignment) **must continue to work** for backward compatibility and edge cases.

---

## 2. Current System State (Investigated)

### 2.1 Tech Stack
- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL + Prisma ORM v6.3.1
- **Auth**: NextAuth.js v4 (Credentials + JWT)
- **State/Data**: TanStack React Query v5
- **Styling**: Tailwind CSS v3.4.1 + Radix UI + Framer Motion
- **External**: Dentally API (appointments, practitioners, patients), Stripe, AWS S3, SendGrid

### 2.2 Current Database Models

```prisma
model ReferralRequest {
  id                String                @id @default(cuid())
  referralFormId    String                @unique
  assignedDentistId String?
  appointmentId     String?               @unique
  requestStatus     ReferralRequestStatus  // ASSIGNED | UNASSIGNED
  createdAt         DateTime              @default(now())
  referralForm      ReferralForm          @relation(fields: [referralFormId], references: [id])
}

enum ReferralRequestStatus {
  ASSIGNED
  UNASSIGNED
}
```

### 2.3 Current Role System

| Role | Token Value | Description |
|------|-------------|-------------|
| Admin | `ADMIN` | Full system access |
| Patient | `PATIENT` | Patient dashboard |
| Dentist (generic) | `DENTIST` | Legacy |
| Dentally Practitioner | `DENTALLY_PRACTITIONER` | Receiving dentist from Dentally |
| Referring Dentist | `REFERRING_DENTIST` | External dentist who sends referrals |

### 2.4 Current Referral Pages

**Admin (Clinic):**
- `/clinic/referrals` → List with ASSIGNED/UNASSIGNED filters
- `/clinic/referrals/[id]/assigned` → Detail when appointment is bound
- `/clinic/referrals/[id]/unassigned` → Detail before appointment bound

**Dentist:**
- `/dentist/referral-request` → Currently unused by `DENTALLY_PRACTITIONER` (not in sidebar)
- `/dentist/referral-history` → Shows referrals where dentist is the **referrer**
- `/dentist/referral-request/[id]` → Detail page (generic skeleton)

### 2.5 Current Binding API

`PATCH /api/referral-requests/[id]` (Admin only):
- Body: `{ appointmentId, requestStatus, practitionerId }`
- On `ASSIGNED`: creates/finds Dentist record from Dentally practitioner, sets `appointmentId`, `assignedDentistId`
- On `UNASSIGNED`: clears `appointmentId` and `assignedDentistId`

---

## 3. Database Schema Changes

### 3.1 Modified Enum: `ReferralRequestStatus`

**File**: `prisma/schema.prisma`

```prisma
enum ReferralRequestStatus {
  UNASSIGNED           // No dentist assigned yet
  PENDING_REVIEW       // Dentist assigned, awaiting their response
  ACCEPTED             // Dentist accepted, awaiting admin to book appointment
  REJECTED             // Dentist rejected
  ASSIGNED             // Appointment bound (existing final state)
}
```

> **Migration Note**: Existing `ASSIGNED` records remain valid. Existing `UNASSIGNED` records remain valid. No data loss.

### 3.2 Modified Model: `ReferralRequest`

**File**: `prisma/schema.prisma`

Add these fields to `ReferralRequest`:

```prisma
model ReferralRequest {
  id                          String                @id @default(cuid())
  referralFormId              String                @unique
  assignedDentistId           String?
  appointmentId               String?               @unique
  requestStatus               ReferralRequestStatus

  // NEW FIELDS
  dentistResponseStatus       DentistResponseStatus?  // PENDING | ACCEPTED | REJECTED
  dentistComments             String?                 // Free-text comments from dentist
  proposedTreatmentDetails    String?                 // What treatment dentist proposes
  proposedConsultationTime    String?                 // When dentist is available
  respondedAt                 DateTime?               // Timestamp of dentist action

  createdAt                   DateTime              @default(now())
  referralForm                ReferralForm          @relation(fields: [referralFormId], references: [id])
}
```

### 3.3 New Enum: `DentistResponseStatus`

**File**: `prisma/schema.prisma`

```prisma
enum DentistResponseStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

### 3.4 Why Single Fields (Not a Separate Table)

**Decision**: Store dentist response as single fields on `ReferralRequest` rather than a separate `ReferralComment` / `ReferralResponse` history table.

**Rationale**:
- The requirement specifies "add some comments" (singular) and "view the progress" (current state, not audit trail).
- Simplest implementation, minimal schema migration.
- Can be extended to a separate table later if full history becomes a requirement.

---

## 4. API Changes

### 4.1 Modified API: `GET /api/referral-requests`

**File**: `src/app/api/referral-requests/route.ts`

**Changes**:
- For `DENTALLY_PRACTITIONER` role + `pageType=REQUEST`: filter by `assignedDentistId = dentist.id` (local DB dentist ID resolved from `token.sub` dentallyId).
- For `REFERRING_DENTIST` role + `pageType=HISTORY`: keep existing filter by `referralForm.referralDentistId`.
- Stats calculation for `DENTALLY_PRACTITIONER` should count by `assignedDentistId` when `pageType=REQUEST`.
- Support filtering by the new statuses (`PENDING_REVIEW`, `ACCEPTED`, `REJECTED`) in addition to existing ones.

### 4.2 Modified API: `GET /api/referral-requests/[id]`

**File**: `src/app/api/referral-requests/[id]/route.ts`

**Changes**:
- Remove the 403 block for `DENTALLY_PRACTITIONER` on GET (currently lines 236-242 block them).
- Allow `DENTALLY_PRACTITIONER` to read the referral request **only if** `assignedDentistId` matches their local dentist ID.
- Include new fields in response: `dentistResponseStatus`, `dentistComments`, `proposedTreatmentDetails`, `proposedConsultationTime`, `respondedAt`.
- Continue to fetch `appointment` from Dentally if `appointmentId` exists.

### 4.3 Modified API: `PATCH /api/referral-requests/[id]`

**File**: `src/app/api/referral-requests/[id]/route.ts`

**Changes**:
- Currently requires `appointmentId` AND `requestStatus`. We need to support a **pure assignment** operation where only `assignedDentistId` is updated without `appointmentId`.
- New allowed body shapes:
  ```ts
  // Pure assignment (no appointment yet)
  { requestStatus: "PENDING_REVIEW", assignedDentistId: string }

  // Unassign (clear dentist)
  { requestStatus: "UNASSIGNED", assignedDentistId: null }

  // Existing bind/unbind (appointment exists)
  { appointmentId: string, requestStatus: "ASSIGNED" | "UNASSIGNED", practitionerId?: number }
  ```
- When `requestStatus` is `PENDING_REVIEW` and `assignedDentistId` is provided:
  - Find or create the Dentist record from the provided ID (same Dentally lookup logic as today).
  - Set `assignedDentistId`.
  - Set `requestStatus = PENDING_REVIEW`.
  - Set `dentistResponseStatus = PENDING` (reset if reassigning).
  - Clear `appointmentId` if previously bound.
- When `requestStatus` is `UNASSIGNED`:
  - Clear `assignedDentistId`, `appointmentId`.
  - Clear `dentistResponseStatus`, `dentistComments`, `proposedTreatmentDetails`, `proposedConsultationTime`, `respondedAt`.
- Keep existing `ASSIGNED` / `UNASSIGNED` logic for appointment binding intact.

### 4.4 New API: `POST /api/referral-requests/[id]/respond`

**File**: `src/app/api/referral-requests/[id]/respond/route.ts` (new file)

**Purpose**: Dentist accepts or rejects the referral and submits their input.

**Auth**: Only `DENTALLY_PRACTITIONER`. Must verify `assignedDentistId` matches their local dentist ID.

**Request Body**:
```json
{
  "action": "ACCEPTED" | "REJECTED",
  "comments": "string (optional)",
  "proposedTreatmentDetails": "string (optional)",
  "proposedConsultationTime": "string (optional)"
}
```

**Behavior**:
- Validate referral exists and is assigned to this dentist (`PENDING_REVIEW` status).
- Update:
  - `dentistResponseStatus = ACCEPTED | REJECTED`
  - `dentistComments = comments`
  - `proposedTreatmentDetails = proposedTreatmentDetails`
  - `proposedConsultationTime = proposedConsultationTime`
  - `respondedAt = now()`
- If `REJECTED`: optionally set `requestStatus` back to `UNASSIGNED` and clear `assignedDentistId` (decision point — see §8.1).

### 4.5 New API: `GET /api/dentally-practitioners`

**File**: `src/app/api/dentally-practitioners/route.ts` (new file, optional wrapper)

**Purpose**: Provide a clean endpoint for the admin modal to list all Dentally practitioners.

**Alternative**: Simply call `getPractitioners()` from the Dentally helper inside the frontend server component or directly in the modal using a React Query hook. Given the codebase pattern, creating a dedicated API route is cleaner and more consistent.

**Response**: Array of practitioners with `id`, `firstName`, `lastName`, `email`, `gdcNumber`.

---

## 5. Frontend Screen & Component Changes

### 5.1 Admin (Clinic) Dashboard

#### A. Referral List Page: `/clinic/referrals`

**Files**:
- `src/app/(dashboards)/clinic/(protected)/referrals/page.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/components/ReferralDataTable.tsx`

**Changes**:
- **Status Column**: Currently shows a green dot for `ASSIGNED` and yellow for `UNASSIGNED`. Must now show:
  - `UNASSIGNED` → Yellow
  - `PENDING_REVIEW` → Blue (new color)
  - `ACCEPTED` → Light Green
  - `REJECTED` → Red
  - `ASSIGNED` → Green
- **Filter Dropdown**: Currently has `ASSIGNED`, `UNASSIGNED`. Add `PENDING_REVIEW`, `ACCEPTED`, `REJECTED`.
- **Row Routing**: Currently routes to `/assigned` or `/unassigned` based on `requestStatus === ASSIGNED`. With new statuses, routing logic needs to change.
  - **Proposed Routing**:
    - `ASSIGNED` → `/clinic/referrals/[id]/assigned`
    - All other statuses (`UNASSIGNED`, `PENDING_REVIEW`, `ACCEPTED`, `REJECTED`) → `/clinic/referrals/[id]/unassigned`
    - Rationale: The "unassigned" detail page is really the "pre-binding" detail page. Renaming the route segment is a larger refactor; we can keep the segment name but make the UI dynamic based on status.

#### B. Unassigned Detail Page: `/clinic/referrals/[id]/unassigned`

**Files**:
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/page.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedWrapper.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedPatientDetails.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/BindAppointmentModal.tsx`

**Changes**:

**`UnAssignedWrapper.tsx`**:
- Fetch `assignedDentist` and new fields from API (already partially included in GET `/api/referral-requests/[id]`).
- Pass new props down to `UnAssignedPatientDetails`:
  - `assignedDentist`
  - `requestStatus`
  - `dentistResponseStatus`
  - `dentistComments`
  - `proposedTreatmentDetails`
  - `proposedConsultationTime`
  - `respondedAt`

**`UnAssignedPatientDetails.tsx`** (Major UI changes):

Current buttons (line 70-74):
```tsx
<CustomButton text="Bind with Appointment" style="primary" handleOnClick={() => setIsBindModalOpen(true)} />
```

New button logic:
```
IF status === UNASSIGNED:
  Show [Assign Referral] button (primary)
  Show [Bind with Appointment] button (disabled or hidden)

IF status === PENDING_REVIEW:
  Show [Unassign Referral] button (secondary / danger)
  Show [Bind with Appointment] button (disabled — waiting for dentist response)

IF status === ACCEPTED:
  Show [Unassign Referral] button (secondary)
  Show [Bind with Appointment] button (primary — enabled because dentist has provided availability)

IF status === REJECTED:
  Show [Unassign Referral] button (primary)
  Show [Reassign Referral] button (primary)
```

**New Component: `AssignDentistModal.tsx`**

**File**: `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/AssignDentistModal.tsx`

**Behavior**:
- Modal triggered by **"Assign Referral"** or **"Reassign Referral"** buttons.
- Lists all Dentally practitioners (fetched via `GET /api/dentally-practitioners` or TanStack Query hook).
- Each row shows: Name, Email, GDC Number.
- Two actions per row:
  - **Assign**: Calls `useAssignDentistMutation` → PATCH `/api/referral-requests/[id]` with `{ requestStatus: "PENDING_REVIEW", assignedDentistId: practitionerId }`.
  - **Unassign**: Only shown if a dentist is currently assigned. Calls `useUnassignDentistMutation` → PATCH same endpoint with `{ requestStatus: "UNASSIGNED", assignedDentistId: null }`.
- After successful assign/unassign → invalidate queries, refresh page, show toast.

**`BindAppointmentModal.tsx`**:
- Keep existing behavior but only enable / show it when status is `ACCEPTED` or `UNASSIGNED`.
- When binding on an `ACCEPTED` referral, after successful bind, status becomes `ASSIGNED` (existing logic handles this).

**New Section: Progress / Dentist Response Card**

Add a new card/section below the Patient & Dentist details that shows:
- **Current Status**: e.g., "Pending Review", "Accepted by Dr. X", "Rejected by Dr. X"
- **Dentist Comments**: Read-only text block
- **Proposed Treatment**: Read-only
- **Proposed Consultation Time**: Read-only
- **Responded At**: Date/time

This card is **visible to Admin** on this page. It is read-only for admin.

#### C. Assigned Detail Page: `/clinic/referrals/[id]/assigned`

**Files**:
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/page.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AssignedWrapper.tsx`
- `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AssignedPatientDetails.tsx`

**Changes**:
- Include the same **Progress / Dentist Response Card** as above (read-only).
- Keep existing `AppointmentCard` showing the bound appointment.
- No assign/unassign buttons here (appointment is already bound).

### 5.2 Dentist Dashboard

#### A. Sidebar Update for `DENTALLY_PRACTITIONER`

**File**: `src/app/(dashboards)/dentist/(protected)/layout.tsx`

Current `RECIEVING_SIDEBAR_CONTENT` (lines 53-72):
```tsx
const RECIEVING_SIDEBAR_CONTENT = [
  { name: "Appointments", ... },
  { name: "Referral", icon: ConsentIcon, href: "/dentist/referral-history" },
];
```

**Change**: Add **"Referral Request"** to the sidebar for `DENTALLY_PRACTITIONER`:
```tsx
const RECIEVING_SIDEBAR_CONTENT = [
  { name: "Appointments", ... },
  { name: "Referral Request", icon: ReferralRequestIcon, href: "/dentist/referral-request" },
  { name: "Referral History", icon: ConsentIcon, href: "/dentist/referral-history" },
];
```

> **Note**: `Referral History` for `DENTALLY_PRACTITIONER` should still show referrals where they are the **referring dentist** (if any), OR it could be repurposed to show completed (`ASSIGNED`) referrals that were assigned to them. The requirement says "he views it in referral request page" for incoming, and "referral history" likely remains for completed ones. For now, keep `Referral History` as-is (referring dentist filter) and make `Referral Request` the incoming assignments page.

#### B. Dentist Referral Request List: `/dentist/referral-request`

**Files**:
- `src/app/(dashboards)/dentist/(protected)/referral-request/page.tsx`
- `src/app/(dashboards)/dentist/(protected)/referral-request/components/ReferralRequestDataTableWrapper.tsx`
- `src/app/(dashboards)/dentist/(protected)/referral-request/components/ReferralRequestDataTable.tsx`
- `src/app/(dashboards)/dentist/(protected)/referral-request/components/StatsCardWrapper.tsx`

**Changes**:
- `ReferralRequestDataTableWrapper.tsx`: Pass `pageType: DentistReferralPageTYpe.REQUEST` (already doing this). The API backend change will handle filtering by `assignedDentistId` for `DENTALLY_PRACTITIONER`.
- `ReferralRequestDataTable.tsx`: Add a **Status** column (currently missing). Show `PENDING_REVIEW`, `ACCEPTED`, `REJECTED`.
- `StatsCardWrapper.tsx`: Update stats to count by `assignedDentistId` for `DENTALLY_PRACTITIONER`.

#### C. Dentist Referral Request Detail: `/dentist/referral-request/[id]`

**Files**:
- `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/page.tsx`
- `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/ReferralRequestDetailsWrapper.tsx`
- `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/PatientReferralDetials.tsx` (typo in filename — "Detials")

**Changes**:

**`ReferralRequestDetailsWrapper.tsx`**:
- Fetch new fields from API.
- Determine role from session (already doing this).
- Pass new props to `PatientReferralDetails`:
  - `requestStatus`
  - `assignedDentistId`
  - `dentistResponseStatus`
  - `dentistComments`
  - `proposedTreatmentDetails`
  - `proposedConsultationTime`
  - `respondedAt`
  - `role` (to determine editable vs read-only)

**`PatientReferralDetails.tsx`** (Major UI changes):

- **If `role === DENTALLY_PRACTITIONER` AND `assignedDentistId` matches them**:
  - Show **Accept** and **Reject** buttons when `dentistResponseStatus === PENDING` (or `requestStatus === PENDING_REVIEW`).
  - Show a **textarea** for comments.
  - Show input fields for **Proposed Treatment Details** and **Proposed Consultation Time**.
  - On click **Accept** → call `useRespondToReferralMutation` with `action: "ACCEPTED"`.
  - On click **Reject** → call same mutation with `action: "REJECTED"`.
  - If already responded (`respondedAt` exists), show a **read-only view** of their previous response with a label "You have already responded to this referral."

- **If `role === DENTALLY_PRACTITIONER` AND status is already responded**:
  - Show the read-only Progress Card (same component as admin sees) but no edit controls.
  - The dentist can "see the progress" as required.

- **If `role === ADMIN`**:
  - This page is not used by admin (admin uses `/clinic/referrals/[id]/...`).

- **No Assign / Unassign / Bind buttons** for dentist.

**New Component: `DentistResponseForm.tsx`**

**File**: `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/DentistResponseForm.tsx`

**Purpose**: Encapsulate the Accept/Reject + inputs form.

### 5.3 Shared / Reusable Components

**New Component: `ReferralProgressCard.tsx`**

**File**: `src/app/(dashboards)/components/ReferralProgressCard.tsx`

**Purpose**: Display the dentist response state consistently across:
- Admin unassigned detail page
- Admin assigned detail page
- Dentist detail page (read-only after response)

**Props**:
```ts
interface ReferralProgressCardProps {
  dentistResponseStatus?: DentistResponseStatus;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: Date | null;
  assignedDentist?: { firstName: string; lastName: string; email: string } | null;
  isReadOnly: boolean;
}
```

---

## 6. TanStack Query Services (Hooks)

### 6.1 Modified File: `src/services/referralRequest/referralRequestMutation.ts`

Add new hooks:

```ts
export const useAssignDentistMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      assignedDentistId,
      practitionerId,
    }: {
      referralRequestId: string;
      assignedDentistId?: string;
      practitionerId?: number;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        {
          requestStatus: "PENDING_REVIEW",
          assignedDentistId,
          practitionerId,
        }
      );
      return response.data;
    },
  });
};

export const useUnassignDentistMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
    }: {
      referralRequestId: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.referralRequest.patch(referralRequestId),
        {
          requestStatus: "UNASSIGNED",
          assignedDentistId: null,
        }
      );
      return response.data;
    },
  });
};

export const useRespondToReferralMutation = () => {
  return useMutation({
    mutationFn: async ({
      referralRequestId,
      action,
      comments,
      proposedTreatmentDetails,
      proposedConsultationTime,
    }: {
      referralRequestId: string;
      action: "ACCEPTED" | "REJECTED";
      comments?: string;
      proposedTreatmentDetails?: string;
      proposedConsultationTime?: string;
    }) => {
      const response = await axiosInstance.post(
        `/api/referral-requests/${referralRequestId}/respond`,
        {
          action,
          comments,
          proposedTreatmentDetails,
          proposedConsultationTime,
        }
      );
      return response.data;
    },
  });
};
```

### 6.2 New/Modified File: `src/services/dentallyPractitioner/dentallyPractitionerQuery.ts`

Add hook:

```ts
export const useGetDentallyPractitioners = () => {
  return useQuery({
    queryKey: ["dentally-practitioners"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/dentally-practitioners");
      return response.data.data;
    },
  });
};
```

Or, if reusing server-side data in the modal, this may not be needed as a React Query hook; the modal can fetch directly.

---

## 7. TypeScript Type Changes

### 7.1 File: `src/types/referral-request.ts`

Update `TReferralRequest`:

```ts
import { DentistResponseStatus, ReferralRequestStatus } from "@prisma/client";

export type TReferralRequest = {
  id: string;
  referralFormId: string;
  requestStatus: ReferralRequestStatus;
  assignedDentistId?: string | null;
  appointmentId?: string | null;
  createdAt: Date;
  referralForm: TReferralForm;
  assignedDentist?: Dentist | null;
  appointment?: TAppointment | null;
  isPractitioner?: boolean;
  isReferringDentistFromDentally?: boolean;

  // NEW FIELDS
  dentistResponseStatus?: DentistResponseStatus | null;
  dentistComments?: string | null;
  proposedTreatmentDetails?: string | null;
  proposedConsultationTime?: string | null;
  respondedAt?: Date | null;
};
```

### 7.2 File: `src/types/dentist.ts` or new file

Add type for Dentally practitioner (if not already existing):

```ts
export type TDentallyPractitioner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gdcNumber?: string;
};
```

---

## 8. Auth & Permission Matrix

### 8.1 Updated Permissions

| Action | Admin | Dentally Practitioner | Referring Dentist |
|--------|-------|----------------------|-------------------|
| View all referrals in list | ✅ | ❌ (only assigned to them) | ❌ (only their own as referrer) |
| View referral detail (any) | ✅ | ⚠️ (only if assigned to them) | ❌ |
| Assign / Unassign dentist | ✅ | ❌ | ❌ |
| Bind / Unbind appointment | ✅ | ❌ | ❌ |
| Accept / Reject referral | ❌ | ✅ (only if assigned to them) | ❌ |
| Add comments / proposed time | ❌ | ✅ (only if assigned to them) | ❌ |
| View dentist response / progress | ✅ | ✅ (read-only after response) | ❌ |
| Delete referral | ✅ | ❌ | ✅ (only their own) |

### 8.2 Middleware Changes

**File**: `src/middleware.ts`

Current `DENTALLY_PRACTITIONER` allowed routes include `/dentist/referral-request` and `/dentist/referral-history`. No change needed for route access.

However, ensure that **API route** `/api/referral-requests/[id]/respond` is accessible to `DENTALLY_PRACTITIONER`.

### 8.3 API Authorization Details

- `GET /api/referral-requests/[id]`: Currently blocks `DENTALLY_PRACTITIONER` at lines 236-242. Must be updated to allow access when `assignedDentistId` matches their resolved local ID.
- `PATCH /api/referral-requests/[id]`: Keep admin-only.
- `POST /api/referral-requests/[id]/respond`: New route, dentist-only, with ownership check.

---

## 9. Implementation Phases

### Phase 1: Database & Backend Foundation
1. Update `prisma/schema.prisma` with new enum and fields.
2. Run `npx prisma migrate dev`.
3. Update `GET /api/referral-requests` to filter by `assignedDentistId` for `DENTALLY_PRACTITIONER`.
4. Update `GET /api/referral-requests/[id]` to include new fields and allow dentist access.
5. Update `PATCH /api/referral-requests/[id]` to support pure assignment without `appointmentId`.
6. Create `POST /api/referral-requests/[id]/respond` route.
7. Create `GET /api/dentally-practitioners` route.

### Phase 2: Admin Frontend
1. Update `ReferralDataTable.tsx` status colors and routing logic.
2. Update `UnAssignedPatientDetails.tsx` button logic and add `AssignDentistModal` trigger.
3. Create `AssignDentistModal.tsx` component.
4. Create `ReferralProgressCard.tsx` shared component.
5. Update `UnAssignedWrapper.tsx` and `AssignedWrapper.tsx` to pass new data.
6. Update `AssignedPatientDetails.tsx` to include progress card.

### Phase 3: Dentist Frontend
1. Update `layout.tsx` sidebar for `DENTALLY_PRACTITIONER` to include Referral Request.
2. Update `ReferralRequestDataTable.tsx` to show status column.
3. Update `ReferralRequestDetailsWrapper.tsx` to pass new props.
4. Update `PatientReferralDetails.tsx` with Accept/Reject UI and response form.
5. Create `DentistResponseForm.tsx`.
6. Add TanStack Query mutation hooks (`useAssignDentistMutation`, `useUnassignDentistMutation`, `useRespondToReferralMutation`).

### Phase 4: Integration & Testing
1. Test full flow: Submit → Assign → Dentist Accepts → Admin Binds Appointment.
2. Test rejection flow and reassignment.
3. Test backward compatibility: old direct bind flow still works.
4. Verify role-based access control (dentist cannot access admin endpoints, admin cannot respond as dentist).
5. Run `npm run build` and fix TypeScript errors.

---

## 10. Exact File Change List

### Modified Files (existing codebase)

| # | File Path | Change Summary |
|---|-----------|----------------|
| 1 | `prisma/schema.prisma` | Add `DentistResponseStatus` enum, expand `ReferralRequestStatus`, add 5 new fields to `ReferralRequest` |
| 2 | `src/app/api/referral-requests/route.ts` | Update `resolveReferralDentistId`, change `baseWhere` for `DENTALLY_PRACTITIONER` + `pageType=REQUEST` to filter by `assignedDentistId` |
| 3 | `src/app/api/referral-requests/[id]/route.ts` | Allow `DENTALLY_PRACTITIONER` GET access with ownership check; update PATCH to support `PENDING_REVIEW` + `assignedDentistId` without `appointmentId`; include new fields in response |
| 4 | `src/types/referral-request.ts` | Add new fields to `TReferralRequest` type |
| 5 | `src/services/referralRequest/referralRequestMutation.ts` | Add `useAssignDentistMutation`, `useUnassignDentistMutation`, `useRespondToReferralMutation` |
| 6 | `src/app/(dashboards)/clinic/(protected)/referrals/components/ReferralDataTable.tsx` | Update status colors, add new status values to filter, update row routing logic |
| 7 | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedWrapper.tsx` | Pass new props (assignedDentist, response fields) |
| 8 | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedPatientDetails.tsx` | Add Assign/Unassign buttons, conditionally enable Bind button, integrate `AssignDentistModal`, integrate `ReferralProgressCard` |
| 9 | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AssignedWrapper.tsx` | Pass new response fields; integrate `ReferralProgressCard` |
| 10 | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AssignedPatientDetails.tsx` | Integrate `ReferralProgressCard` |
| 11 | `src/app/(dashboards)/dentist/(protected)/layout.tsx` | Add `"Referral Request"` to `RECIEVING_SIDEBAR_CONTENT` |
| 12 | `src/app/(dashboards)/dentist/(protected)/referral-request/components/ReferralRequestDataTable.tsx` | Add Status column; show new statuses |
| 13 | `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/ReferralRequestDetailsWrapper.tsx` | Fetch and pass new fields + role |
| 14 | `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/PatientReferralDetials.tsx` | Add Accept/Reject buttons, response form inputs, read-only progress view |
| 15 | `src/app/(dashboards)/dentist/(protected)/referral-request/components/StatsCardWrapper.tsx` | Update stat queries for `assignedDentistId` filtering |
| 16 | `src/middleware.ts` | (Verify) Ensure dentist can access `/api/referral-requests/[id]/respond` |

### New Files to Create

| # | File Path | Purpose |
|---|-----------|---------|
| 1 | `src/app/api/referral-requests/[id]/respond/route.ts` | Dentist accept/reject + comments API |
| 2 | `src/app/api/dentally-practitioners/route.ts` | List Dentally practitioners for admin modal |
| 3 | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/AssignDentistModal.tsx` | Admin modal to assign/unassign Dentally practitioners |
| 4 | `src/app/(dashboards)/components/ReferralProgressCard.tsx` | Shared read-only card showing dentist response |
| 5 | `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/DentistResponseForm.tsx` | Form for dentist to accept/reject + add details |
| 6 | `src/services/dentallyPractitioner/dentallyPractitionerQuery.ts` | (Optional) React Query hook for practitioners list |

---

## 11. UI Mock Logic (Pseudocode)

### Admin Detail Page Buttons

```
function getAdminActions(status, assignedDentistId) {
  if (status === "UNASSIGNED") {
    return [
      { label: "Assign Referral", action: "openAssignModal", primary: true },
      { label: "Bind Appointment", action: "openBindModal", disabled: true }
    ];
  }

  if (status === "PENDING_REVIEW") {
    return [
      { label: "Unassign Referral", action: "unassign", danger: true },
      { label: "Bind Appointment", action: "openBindModal", disabled: true }
    ];
  }

  if (status === "ACCEPTED") {
    return [
      { label: "Unassign Referral", action: "unassign", danger: true },
      { label: "Bind Appointment", action: "openBindModal", primary: true }
    ];
  }

  if (status === "REJECTED") {
    return [
      { label: "Unassign Referral", action: "unassign" },
      { label: "Reassign Referral", action: "openAssignModal", primary: true }
    ];
  }

  if (status === "ASSIGNED") {
    return [
      { label: "View Appointment", action: "navigateToAppointment" }
    ];
  }
}
```

### Dentist Detail Page Buttons

```
function getDentistActions(role, assignedDentistId, myDentistId, dentistResponseStatus) {
  if (role !== "DENTALLY_PRACTITIONER") return [];
  if (assignedDentistId !== myDentistId) return [];

  if (!dentistResponseStatus || dentistResponseStatus === "PENDING") {
    return [
      { label: "Accept Referral", action: "accept", primary: true },
      { label: "Reject Referral", action: "reject", danger: true }
    ];
  }

  // Already responded — read only
  return [
    { label: "View Progress", action: "scrollToProgress", disabled: true }
  ];
}
```

---

## 12. Risks & Edge Cases

| Risk | Mitigation |
|------|------------|
| Existing `ASSIGNED` / `UNASSIGNED` logic breaks | Keep existing PATCH branches intact. Only add new branches for `PENDING_REVIEW`. |
| Dentist role confusion (`DENTALLY_PRACTITIONER` vs `REFERRING_DENTIST`) | `DENTALLY_PRACTITIONER` is the **receiving** dentist. `REFERRING_DENTIST` is the sender. Keep their respective pages separate. |
| Reassigning a dentist after rejection | Admin clicks "Reassign" → modal opens → picks new dentist → status resets to `PENDING_REVIEW` with new `assignedDentistId`. |
| Dentally practitioner not in local DB | Use existing logic in PATCH: fetch from Dentally by `practitionerId`, create `Dentist` record with role `DENTALLY_PRACTITIONER`. |
| Admin tries to bind appointment before dentist accepts | UI disables the button when status is not `ACCEPTED`. API can also reject binds if status is not `ACCEPTED` or `UNASSIGNED`. |
| Dentist comments / proposed time gets overwritten | Single-field storage means each response overwrites previous. If history is needed later, migrate to a separate table. |

---

## 13. Open Decisions (To Be Confirmed)

The following decisions were made during this review. They can be changed before implementation begins.

1. **Rejection Handling**: If a dentist rejects, should the referral:
   - **(A)** Automatically clear `assignedDentistId` and revert to `UNASSIGNED` (allowing immediate reassignment)?
   - **(B)** Stay in `REJECTED` state with the rejecting dentist still recorded, requiring admin to manually unassign first?
   - **Chosen for this spec**: (B) — admin sees rejection and decides next step.

2. **Dentist Referral History**: Should `DENTALLY_PRACTITIONER`'s **Referral History** page show:
   - **(A)** Referrals they referred (current behavior, `referralForm.referralDentistId`)?
   - **(B)** Referrals assigned to them that are now `ASSIGNED` (completed)?
   - **(C)** Both, via tabs?
   - **Chosen for this spec**: Keep (A) for now. The new **Referral Request** page handles incoming assignments. History can be revisited later.

3. **Status Badge Colors**:
   - `UNASSIGNED` → Yellow (`#fcd833`)
   - `PENDING_REVIEW` → Blue (`#3b82f6`)
   - `ACCEPTED` → Light Green (`#86efac`)
   - `REJECTED` → Red (`#ef4444`)
   - `ASSIGNED` → Green (`bg-green`)

---

## 14. Appendices

### A. Existing File Paths Reference

| Category | Path |
|----------|------|
| Schema | `/home/office/Code/aspire-clinix/prisma/schema.prisma` |
| Auth | `src/lib/auth.ts`, `src/middleware.ts` |
| Referral APIs | `src/app/api/referrals/route.ts`, `src/app/api/referral-requests/route.ts`, `src/app/api/referral-requests/[id]/route.ts` |
| Appointment APIs | `src/app/api/appointments/route.ts`, `src/app/api/appointments/patient/route.ts` |
| Dentally Helpers | `src/dentallyHelpers/practitioners.ts`, `src/dentallyHelpers/appointment.ts`, `src/dentallyHelpers/patient.ts` |
| Admin Referral Pages | `src/app/(dashboards)/clinic/(protected)/referrals/page.tsx` |
| Admin Referral Detail (Unassigned) | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/page.tsx` |
| Admin Referral Detail (Assigned) | `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/page.tsx` |
| Dentist Referral Request | `src/app/(dashboards)/dentist/(protected)/referral-request/page.tsx` |
| Dentist Referral Request Detail | `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/page.tsx` |
| Dentist Layout | `src/app/(dashboards)/dentist/(protected)/layout.tsx` |
| Services | `src/services/referralRequest/referralRequestQuery.ts`, `src/services/referralRequest/referralRequestMutation.ts` |
| Types | `src/types/referral-request.ts`, `src/types/appointment.ts`, `src/types/dentist.ts` |

---

**End of Document**
