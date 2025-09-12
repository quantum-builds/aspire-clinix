-- CreateIndex
CREATE INDEX "Report_dentistId_idx" ON "Report"("dentistId");

-- CreateIndex
CREATE INDEX "Report_patientId_idx" ON "Report"("patientId");

-- CreateIndex
CREATE INDEX "Report_fileType_idx" ON "Report"("fileType");

-- CreateIndex
CREATE INDEX "Resource_fileType_idx" ON "Resource"("fileType");
