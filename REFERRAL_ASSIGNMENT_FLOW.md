# Referral Assignment & Dentist Response Flow

## What Changed & Why

### The Problem

The original flow required the admin to:
1. Book an appointment in Dentally
2. Bind it to the referral

There was no way to **involve the receiving dentist** in the process — the admin had to guess availability, book blindly, and the dentist had no chance to review or accept/reject the referral before the appointment was bound.

### The New Flow

Now there's a two-step process that puts the **Dentally practitioner** in control of their availability:

```
Referral Submitted (UNASSIGNED)
        ↓
Admin clicks "Assign Referral" → picks a Dentally practitioner
        ↓
Status → PENDING_REVIEW
        ↓
Dentist sees it in their "Referral Request" page
        ↓
Dentist reviews → Accepts or Rejects + adds comments + proposed time/treatment
        ↓
Status → ACCEPTED / REJECTED
        ↓
Admin sees the dentist's response + proposed availability
        ↓
Admin books appointment in Dentally (guided by dentist's proposed time)
        ↓
Admin clicks "Bind with Appointment" → status → ASSIGNED (existing flow)
```

The **old direct-bind flow still works** (for edge cases where no dentist assignment is needed).

---

## Database Changes

**File**: `prisma/schema.prisma`

### New Enum: `DentistResponseStatus`
```prisma
enum DentistResponseStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

### Extended Enum: `ReferralRequestStatus`
```prisma
enum ReferralRequestStatus {
  UNASSIGNED       // Default — no dentist assigned
  PENDING_REVIEW   // Dentist assigned, waiting for their response
  ACCEPTED         // Dentist accepted, admin can now book + bind
  REJECTED         // Dentist rejected, admin can reassign
  ASSIGNED         // Appointment bound (existing final state)
}
```

### New Fields on `ReferralRequest` model
| Field | Type | Purpose |
|-------|------|---------|
| `dentistResponseStatus` | `DentistResponseStatus?` | PENDING → ACCEPTED → REJECTED |
| `dentistComments` | `String?` | Free-text from dentist |
| `proposedTreatmentDetails` | `String?` | What treatment dentist proposes |
| `proposedConsultationTime` | `String?` | When dentist is available |
| `respondedAt` | `DateTime?` | When dentist responded |

---

## API Changes

### Modified: `GET /api/referral-requests`
- `DENTALLY_PRACTITIONER` + `pageType=REQUEST` → now filters by `assignedDentistId` (incoming assignments) instead of `referralForm.referralDentistId` (sent referrals)
- Stats counting supports all new statuses dynamically

### Modified: `GET /api/referral-requests/[id]`
- `DENTALLY_PRACTITIONER` can now access **only if** `assignedDentistId` matches their local Dentist ID
- Response includes new fields (`dentistResponseStatus`, `dentistComments`, etc.)

### Modified: `PATCH /api/referral-requests/[id]`
- **New operation**: Assign a dentist (`requestStatus: "PENDING_REVIEW"`) without needing an `appointmentId`
- **New operation**: Unassign dentist (`requestStatus: "UNASSIGNED"`) — clears all assignment + dentist response data
- Existing bind/unbind by `appointmentId` preserved intact

### New: `POST /api/referral-requests/[id]/respond`
- Dentist-only endpoint
- Accepts `action: "ACCEPTED" | "REJECTED"`, optional comments, proposed treatment, proposed time
- Validates: only `DENTALLY_PRACTITIONER`, only if referral is `PENDING_REVIEW` and assigned to them

### New: `GET /api/dentally-practitioners`
- Admin-only endpoint listing all Dentally practitioners
- Returns `id`, `firstName`, `lastName`, `email`, `gdcNumber`
- Powers the AssignDentistModal

---

## Frontend Changes

### Admin (Clinic) Dashboard

| Page/Component | Change |
|----------------|--------|
| `/clinic/referrals` | Status filters now include `PENDING_REVIEW`, `ACCEPTED`, `REJECTED`. Status badges have distinct colors. |
| `ReferralDataTable.tsx` | Routing picks `/unassigned` or `/assigned` based on status. New color scheme for status dots. |
| `UnAssignedPatientDetails.tsx` | Buttons change dynamically by status: **Assign** → **Unassign** → **Bind**. Integrates `ReferralProgressCard`. |
| `UnAssignedWrapper.tsx` | Passes new fields (assignedDentist, dentistResponseStatus, etc.) to the component. |
| `AssignedWrapper.tsx` | Shows `ReferralProgressCard` alongside the existing AppointmentCard for bound referrals. |
| **New: `AssignDentistModal.tsx`** | Lists all Dentally practitioners with Assign/buttons. Opens when admin clicks "Assign Referral" or "Reassign Referral". |
| **New: `ReferralProgressCard.tsx`** | Shared read-only card showing current status, assigned dentist info, dentist comments/proposed time/treatment. Used on both admin and dentist detail pages. |

### Dentist Dashboard

| Page/Component | Change |
|----------------|--------|
| `layout.tsx` | `DENTALLY_PRACTITIONER` sidebar now includes **"Referral Request"** tab (was missing before). |
| `ReferralRequestDataTable.tsx` | Added **Status** column showing colored badges. |
| `ReferralRequestDetailsWrapper.tsx` | Resolves whether the logged-in dentist owns this referral (`assignedDentistId` match). Passes all new props. |
| `PatientReferralDetials.tsx` | Shows **Accept/Reject buttons** + comments/treatment/time form when `PENDING_REVIEW`. Shows read-only `ReferralProgressCard` after responding. |
| **New: `DentistResponseForm.tsx`** | Form with Accept/Reject buttons, comments textarea, proposed treatment input, proposed availability input. |

---

## Status Flow & Button Logic

### Admin Detail Page Buttons

```
UNASSIGNED      → [Assign Referral] (primary)       [Bind Appointment] (hidden)
PENDING_REVIEW  → [Unassign Referral] (secondary)   [Bind Appointment] (hidden)
ACCEPTED        → [Unassign Referral] (secondary)   [Bind Appointment] (primary)
REJECTED        → [Unassign Referral]               [Reassign Referral] (primary)
ASSIGNED        → (uses /assigned page — no action buttons, shows AppointmentCard)
```

### Dentist Detail Page Buttons

```
PENDING_REVIEW + isAssignedToMe = true → [Accept Referral] [Reject Referral] + form
Already responded                      → Read-only progress card (no buttons)
Not assigned to me                     → Read-only referral details (no action possible)
```

---

## Auth Permissions

| Action | Admin | Dentally Practitioner | Referring Dentist |
|--------|-------|----------------------|-------------------|
| Assign/Unassign dentist | ✅ | ❌ | ❌ |
| Bind Appointment | ✅ | ❌ | ❌ |
| View referral detail | ✅ | ⚠️ (only if assigned) | ❌ |
| Accept/Reject referral | ❌ | ✅ (only if assigned) | ❌ |
| Add comments/time/treatment | ❌ | ✅ (only if assigned) | ❌ |

---

## Files Changed

### Modified (16 files)
1. `prisma/schema.prisma` — Schema + enum changes
2. `src/config/api-config.ts` — Added `respond` endpoint
3. `src/types/referral-request.ts` — New optional fields
4. `src/services/referralRequest/referralRequestMutation.ts` — 3 new mutation hooks
5. `src/app/api/referral-requests/route.ts` — AssignedDentistId filtering
6. `src/app/api/referral-requests/[id]/route.ts` — Dentist GET access + PATCH assignment
7. `src/app/(dashboards)/clinic/(protected)/referrals/page.tsx` — Added status filters
8. `src/app/(dashboards)/clinic/(protected)/referrals/components/ReferralDataTable.tsx` — Status colors + routing
9. `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedWrapper.tsx` — New props
10. `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/UnAssignedPatientDetails.tsx` — Dynamic buttons + progress card
11. `src/app/(dashboards)/clinic/(protected)/referrals/[id]/assigned/components/AssignedWrapper.tsx` — Progress card integration
12. `src/app/(dashboards)/dentist/(protected)/layout.tsx` — Sidebar "Referral Request"
13. `src/app/(dashboards)/dentist/(protected)/referral-request/page.tsx` — Status filters
14. `src/app/(dashboards)/dentist/(protected)/referral-request/components/ReferralRequestDataTable.tsx` — Status column
15. `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/ReferralRequestDetailsWrapper.tsx` — New props + dentist match
16. `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/PatientReferralDetials.tsx` — Accept/Reject + response form

### New (6 files)
1. `src/app/api/referral-requests/[id]/respond/route.ts` — Dentist response API
2. `src/app/api/dentally-practitioners/route.ts` — Practitioner list API
3. `src/app/(dashboards)/components/ReferralProgressCard.tsx` — Progress card
4. `src/app/(dashboards)/clinic/(protected)/referrals/[id]/unassigned/components/AssignDentistModal.tsx` — Assign modal
5. `src/app/(dashboards)/dentist/(protected)/referral-request/[id]/components/DentistResponseForm.tsx` — Response form
6. `src/services/dentallyPractitioner/dentallyPractitionerQuery.ts` — React Query hook
