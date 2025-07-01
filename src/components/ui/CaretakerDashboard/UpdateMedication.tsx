import styles from "./Css/MedicationForm.module.css";
import { useRef } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/SupabaseConnection";
interface MedicationData {
  name: string;
  doseage: string;
  frequency: string;
  enddate: string;
}

const UpdateMedication = ({ setModal, medicationid, fetchData}) => {
  const MedicationData = useRef<MedicationData>({
    name: "",
    doseage: "",
    frequency: "",
    enddate: "",
  });
  const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log(MedicationData);
      console.log(medicationid);
      const { data: existingData, error: fetchError } = await supabase
        .from("Medications")
        .select("*")
        .eq("id", medicationid)
        .single();

      if (fetchError || !existingData) {
        Swal.fire({
          icon: "error",
          text: "Medication Not Found",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const updatedData = {
        name: MedicationData.current.name || existingData.name,
        doseage: MedicationData.current.doseage || existingData.doseage,
        frequency: MedicationData.current.frequency || existingData.frequency,
        end_date: MedicationData.current.enddate || existingData.enddate,
      };
      const { data, error } = await supabase
        .from("Medications")
        .update(updatedData)
        .eq("id", medicationid).select();
        console.log(data);
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Medication Updated",
          text: "The prescription details have been successfully updated.",
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then(async(result)=>{
          if(result.isConfirmed){
            await fetchData()
            setModal(false);
          }
        });
      }
      console.log(error);
      if(error){
        throw error
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Something Went Wrong,Please Try again later",
        confirmButtonColor: "rgb(22, 163, 74)",
      });
    }
  };
  return (
    <div
      className="modal fade show d-block modal-xl"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      style={{
        "backdrop-filter": "blur(5px)",
        "background-color": "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center" id="staticBackdropLabel">
              Update Prescription Information
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className={`${styles.card} border-0 shadow-sm`}>
              <div className="card-body p-4">
                <form
                  className="row g-3 align-items-end"
                  onSubmit={handleSubmitbutton}
                  noValidate
                >
                  {/* Medication Name */}
                  <div className="col-md-3">
                    <label
                      htmlFor="medicationName"
                      className={`${styles.formlabel} fw-medium text-muted`}
                    >
                      Medication Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span
                        className={`${styles.inputgrouptext} input-group-text`}
                      >
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
                    <label
                      htmlFor="dosage"
                      className="form-label fw-medium text-muted"
                    >
                      Dosage <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span
                        className={`${styles.inputgrouptext} input-group-text`}
                      >
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
                      <span
                        className={`${styles.inputgrouptext} input-group-text`}
                      >
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
                      <span
                        className={`${styles.inputgrouptext} input-group-text`}
                      >
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateMedication;
