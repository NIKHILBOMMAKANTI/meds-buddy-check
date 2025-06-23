import styles from "./Css/Patientsection.module.css";
import React, { useState, useEffect } from "react";
import { supabase } from "@/SupabaseConnection";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface IdProp {
  caretakerid: string;
}

const Patientsection: React.FC<IdProp> = ({ caretakerid }) => {
  const [patientdata, setPatientData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("assignee", caretakerid)
        .eq("role", "patient");
      
      console.log(data);
      if (error) {
        Swal.fire({
          icon: "error",
          text: `${error.message}`,
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then((result)=>{
          if(result.isConfirmed){
            navigate("/Login");
          }
        });
      }
      setPatientData(data);
    };
    fetchData();
  }, []);
  
  const HandleRedirection = (patientid)=>{
    navigate(`/caretaker/${patientid}`);
  }
  return (
    <div className={styles.patientssection} >
      <div className={styles.sectionheader}>
        <h2>Registered Patients</h2>
        <div className={styles.controls}>
          <div className={styles.searchbar}>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search patients..." />
          </div>
          <button className={styles.btnrefresh}>
            <i className="fas fa-sync-alt"></i>
          </button>
          <button className={styles.btndownload}>
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>

      <div className={styles.patientsgrid}>
        {patientdata.map((patient) => (
          <div className={styles.patientcard} key={patient.id} onClick={()=>{HandleRedirection(patient.id)}}>
            <div className={styles.cardheader}>
              <div className={styles.patientavatar}>
                <i className="fas fa-user-circle"></i>
              </div>
              <div
                className={`${styles.patientinfo} d-flex align-items-center`}
              >
                <h3>{patient.username}</h3>
              </div>
            </div>

            <div className={styles.cardbody}>
              <div className={styles.inforow}>
                <i className="fas fa-envelope"></i>
                <span>{patient.email}</span>
              </div>
              <div className={styles.inforow}>
                <i className="fas fa-calendar-alt"></i>
                <span>Joined {patient.joined}</span>
              </div>
            </div>

            <div className={`${styles.cardfooter} justify-content-evenly`}>
              <button className={`${styles.btnaction} ${styles.edit}`}>
                <i className="fas fa-edit"></i>
              </button>
              <button className={`${styles.btnaction} ${styles.delete}`}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button className={`${styles.pagebtn} disabled`}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className={`${styles.pagebtn} active`}>1</button>
        <button className={styles.pagebtn}>2</button>
        <button className={styles.pagebtn}>3</button>
        <button className={styles.pagebtn}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
export default Patientsection;
