import { supabase } from "@/SupabaseConnection";
import React, { useState,useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import UpdateMedication from "./UpdateMedication";
import Swal from "sweetalert2";
const MedicationHistory: React.FC = () => {
  const patientid = useParams();
  const id = patientid.id;
  console.log(id);
  const [Medicationdata, setMedicationData] = useState([]);
  const [showmodal,setModal] = useState(false);
  const [medicationid,setMedicationId] = useState();
  const fetchData = async () => {
      const { data, error } = await supabase
        .from("Medications")
        .select("*")
        .eq("patient_id", id);
      console.log(Medicationdata);
      setMedicationData(data);
    };
  useEffect(() => {
    fetchData();
  }, []);
  const handledeletebtn = async (Medicationid) => {
    const { data, error } = await supabase.from("Medications").delete().eq("id", Medicationid).select();
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Unable to delete the medication. Please try again later or contact support.",
        confirmButtonColor: "rgb(22, 163, 74)",

      });
    }
    if(data){
      Swal.fire({
        icon: "success",
        title:"Deleted!!",
        text:"Medication has been deleted successfully.",
        confirmButtonColor: "rgb(22, 163, 74)",
      }).then(async (result)=>{
        if(result.isConfirmed){
        const {data:MedicationLogsData,error:MedicationLogsDataerror} =  await supabase.from("MedicationLogs").delete().eq("medication_id",Medicationid).select()
        window.location.reload();
        }
      })
    }    
  };
const handleupdatebtn = (Medicationid)=>{
  setMedicationId(Medicationid);
  setModal(true);
}
  return (
    <>
      {Medicationdata.map((Medication) => {
        console.log(Medication);
        return (
          <div
            className="card mb-3 border-0 bg-transparent"
            key={Medication.id}
          >
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
                    <small className="text-muted">End Date:</small>
                    <small className="text-muted"> {Medication.end_date}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border">
                    {Medication.frequency}
                  </span>
                  <span className="badge bg-secondary">
                    {Medication.doseage}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-success" onClick={()=>handleupdatebtn(Medication.id)}>
                    Update
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handledeletebtn(Medication.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    {showmodal && <UpdateMedication setModal={setModal} medicationid={medicationid} fetchData={fetchData}/>}
    </>
  );
};

export default MedicationHistory;
