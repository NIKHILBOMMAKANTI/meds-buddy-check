import styles from "./Css/EnrollPatient.module.css";
import React from 'react';
import { PatientDataType } from "@/pages/Admin";
interface PatientDataprop {
  PatientData:React.RefObject<PatientDataType>,
  handleSubmitbutton: ()=>void
}
const EnrollPatient:React.FC<PatientDataprop> = ({PatientData,handleSubmitbutton}) => {
  return (
    <div className="form-section">
      <div className={`${styles.card} ${styles.registrationcard}`}>
        <div className={styles.cardheader}>
          <h2>Register New Patient</h2>
          <p>Add new patients to the care management system</p>
        </div>
        <div className={styles.cardbody}>
          <form className={styles.patientform} onSubmit={handleSubmitbutton}>
            <div className={styles.formgroup}>
              <label htmlFor="username">Username</label>
              <div className={styles.inputwithicon}>
                <i className="fas fa-user"></i>
                <input type="text" id="username" placeholder="Enter patient username" onChange={(e)=>PatientData.current['username'] = e.target.value}/>
              </div>
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputwithicon}>
                <i className="fas fa-envelope"></i>
                <input type="email" id="email" placeholder="patient@example.com" onChange={(e)=>PatientData.current['email'] = e.target.value}/>
              </div>
            </div>

              <div className={styles.formgroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputwithicon}>
                  <i className="fas fa-lock"></i>
                  <input type="password" id="password" placeholder="••••••••" onChange={(e)=>PatientData.current['password'] = e.target.value}/>
                </div>
              </div>

              
                <div className={styles.formgroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.inputwithicon}>
                    <i className="fas fa-check-circle"></i>
                    <input type="password" id="confirmPassword" placeholder="••••••••" onChange={(e)=>PatientData.current['confirmpassword'] = e.target.value}/>
                  </div>
                </div>
            <button type="submit" className={styles.submitbtn}>
              <i className="fas fa-user-plus"></i>
              Register Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EnrollPatient;
