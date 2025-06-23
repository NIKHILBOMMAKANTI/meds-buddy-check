import React, { useEffect, useState } from "react";
import styles from "./Css/MedicationForm.module.css";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/SupabaseConnection";
import Swal from "sweetalert2";
interface MedicationData {
  name: string;
  doseage: string;
  frequency: string;
  enddate: string;
}
const MedicationForm: React.FC = () => {
  const MedicationData = useRef<MedicationData>({
    name: "",
    doseage: "",
    frequency: "",
    enddate: "",
  });
  const [patientdata, setPatientData] = useState([]);
  const patientid = useParams();
  const id = patientid.id;
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", id)
        .single();
      setPatientData(data);
      console.log(data);
    };
    fetchData();
  }, []);
  const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log("hello");
      console.log(MedicationData.current);
      const { name, doseage, frequency, enddate } = MedicationData.current;
      if (!name || !doseage || !frequency || !enddate) {
        Swal.fire({
          icon: "error",
          title: "All fields are required",
          text: "Please fill out all the fields before submitting the form.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const { data, error } = await supabase
        .from("Medications")
        .insert({
          name: name,
          doseage: doseage,
          frequency: frequency,
          end_date: enddate,
          patient_id: id,
          caretaker_id: patientdata["assignee"],
        })
        .select();
      console.log(data);
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Medication Added Successfully",
          text: "The medication has been added to the patient's record.",
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then((result)=>{
            if(result.isConfirmed){
                window.location.reload();
            }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`${styles.card} border-0 shadow-sm`}>
      <div className="card-body p-4">
        <form className="row g-3 align-items-end" onSubmit={handleSubmitbutton}>
          {/* Medication Name */}
          <div className="col-md-3">
            <label
              htmlFor="medicationName"
              className={`${styles.formlabel} fw-medium text-muted`}
            >
              Medication Name <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className={`${styles.inputgrouptext} input-group-text`}>
                <i className="fas fa-pills"></i>
              </span>
              <input
                type="text"
                className={`${styles.formcontrol} form-control form-control-sm`}
                id="medicationName"
                placeholder="Enter Medication"
                required
                onChange={(e) =>
                  (MedicationData.current["name"] = e.target.value)
                }
              />
            </div>
          </div>

          {/* Dosage */}
          <div className="col-md-2">
            <label htmlFor="dosage" className="form-label fw-medium text-muted">
              Dosage <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className={`${styles.inputgrouptext} input-group-text`}>
                <i className="fas fa-syringe"></i>
              </span>
              <input
                type="text"
                className={`${styles.formcontrol} form-control form-control-sm`}
                id="dosage"
                placeholder="Enter Dosage"
                required
                onChange={(e) =>
                  (MedicationData.current["doseage"] = e.target.value)
                }
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="col-md-2">
            <label
              htmlFor="frequency"
              className="form-label fw-medium text-muted"
            >
              Frequency <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className={`${styles.inputgrouptext} input-group-text`}>
                <i className="fas fa-clock"></i>
              </span>
              <select
                className={`${styles.formselect} form-select-sm`}
                id="frequency"
                required
                onChange={(e) =>
                  (MedicationData.current["frequency"] = e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="once daily">Once Daily</option>
                <option value="twice daily">Twice Daily</option>
                <option value="three times">Three Times</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          {/* End Date */}
          <div className="col-md-2">
            <label
              htmlFor="endDate"
              className="form-label fw-medium text-muted"
            >
              End Date
            </label>
            <div className="input-group">
              <span className={`${styles.inputgrouptext} input-group-text`}>
                <i className="fas fa-calendar"></i>
              </span>
              <input
                type="date"
                className={`${styles.formcontrol} form-control form-control-sm`}
                id="endDate"
                onChange={(e) =>
                  (MedicationData.current["enddate"] = e.target.value)
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-md-3">
            <button
              type="submit"
              className={`btn ${styles.btnprimary} btn-sm w-100 py-2 fw-medium`}
            >
              <i className="fas fa-plus-circle me-2"></i>
              Add Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MedicationForm;
