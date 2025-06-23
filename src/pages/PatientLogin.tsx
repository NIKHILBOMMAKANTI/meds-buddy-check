import styles from "./Css/Registrtion.module.css";
import AccountHeader from "@/components/ui/Registration/AccountHeader";
import LoginForm from "@/components/ui/Login/LoginForm";
import Submitbtn from "@/components/ui/Registration/Submitbtn";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/SupabaseConnection";
import { useNavigate } from "react-router-dom";

interface PatientDatatype {
  email: string;
  password: string;
}
const PatientLogin = () => {
  const Patientdata = useRef<PatientDatatype>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { email, password } = Patientdata.current;
      
      if (!email || !password) {
        Swal.fire({
          icon: "error",
          title: "All fields are required",
          text: "Please fill out all the fields before submitting the form.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      console.log(email,password);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log(data);
      console.log(error);
      if (error) {
        Swal.fire({
          icon: "error",
          text: `${error.message}`,
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      if (data.user) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You are now signed in to your account.",
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/patient/${data.user.id}`);
          }
        });
      }
     
    } catch (error) {
      Swal.fire({
        icon: "error",
        title:"Something Went Wrong!!",
        text: `${error.message}`,
        confirmButtonColor: "rgb(22, 163, 74)",
      });
    }
  };
  return (
    <div className={styles.registrationcontainer}>
      <div className={styles.registrationcard}>
        <AccountHeader
          HeaderHeading="Welcome Back"
          HeaderText="Sign in to continue your journey"
        />
        <form className={styles.registrationform} onSubmit={handleSubmitbutton}>
          <LoginForm LoginFormData={Patientdata} />
          <Submitbtn btntext="Sign In" />
        </form>
      </div>
    </div>
  );
};
export default PatientLogin;
