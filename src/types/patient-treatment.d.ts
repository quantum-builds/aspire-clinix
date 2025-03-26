export interface CreatePatientTreatment {
  dentistId: string;
  patientId: string;
  treatmentId: string;
  treatmentDate: Date;
  treatmentStatus: PatientTreatmentStatus;
}

enum PatientTreatmentStatus {
  SCHEDULED,
  PENDING,
  RESCHEDULED,
  ONGOING,
  COMPLETED,
  CANCELED,
  NO_SHOW,
  FAILED,
  EXPIRED,
}

export interface UpdatePatientTreatment {
  id: string;
  dentistId?: string;
  patientId?: string;
  treatmentId?: string;
  treatmentDate?: Date;
  treatmentStatus?: PatientTreatmentStatus;
}
