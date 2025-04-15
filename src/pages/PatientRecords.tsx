
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import PatientRecordsView from "@/components/patients/PatientRecordsView";

const PatientRecordsPage = () => {
  return (
    <AppLayout>
      <PatientRecordsView />
    </AppLayout>
  );
};

export default PatientRecordsPage;
