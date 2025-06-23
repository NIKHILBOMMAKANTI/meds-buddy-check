import { supabase } from "@/SupabaseConnection";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MedicationHistory: React.FC = () => {
  const patientid = useParams();
  const id = patientid.id;
  console.log(id);
  const [Medicationdata, setMedicationData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Medications")
        .select("*")
        .eq("patient_id", id);
        console.log(Medicationdata);
      setMedicationData(data);
    };
    fetchData();
  }, []);
  return (
    <>
      {Medicationdata.map((Medication) => {
        console.log(Medication);
        return (
          <div className="card mb-3  border-0 bg-transparent" key={Medication.id}>
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center mb-3 border p-3 rounded">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fas fa-pills text-success"></i>
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{Medication.name}</p>
                    <small className="text-muted">End Date:</small> <small className="text-muted">{Medication.end_date}</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark d-flex align-items-center border">
              <p>{Medication.frequency}</p>
            </span>
            <span className="badge bg-secondary">{Medication.doseage}</span>
          </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MedicationHistory;
