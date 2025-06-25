import AccountHeader from "@/components/ui/Registration/AccountHeader";
import LoginForm from "@/components/ui/Login/LoginForm";
import Divider from "@/components/ui/Registration/Divider";
import Submitbtn from "@/components/ui/Registration/Submitbtn";
import AuthSwitchPrompt from "@/components/ui/Registration/AuthSwitchPrompt";
import styles from "./Css/Registrtion.module.css";
import React, { useRef } from "react";
import { supabase } from "@/SupabaseConnection";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export interface LoginDataType {
  email: string;
  password: string;
}
const Registration: React.FC = () => {
  const navigate = useNavigate()
  const LoginFormData = useRef<LoginDataType>({
    email: "",
    password: "",
  });
   const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { email, password } = LoginFormData.current;
      if (!email || !password) {
        Swal.fire({
          icon: "error",
          title: "All fields are required",
          text: "Please fill out all the fields before submitting the form.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const UsersData = await supabase.from('Users').select('*').eq('email',email).single()
      console.log(UsersData.data);
      if(UsersData.data.role === 'patient'){
        Swal.fire({
          icon: "error",
          title:"Permission Denied",
          text: `You are not authorized to view this content`,
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log(data);
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
            navigate(`/caretaker/Admin/${data.user.id}`);
          }
        });
      }
    } catch (error) {
      console.log(error);
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
          <LoginForm LoginFormData={LoginFormData} />
          <Submitbtn btntext="Sign In" />
          <Divider />
          <AuthSwitchPrompt
            text="Dont have an account?"
            link="Sign up"
            redirectTo="/Register"
          />
        </form>
      </div>
    </div>
  );
};

export default Registration;
