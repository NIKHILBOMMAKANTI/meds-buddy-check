import AccountHeader from "@/components/ui/Registration/AccountHeader";
import RegistrationForm from "@/components/ui/Registration/RegistrationForm";
import Divider from "@/components/ui/Registration/Divider";
import Submitbtn from "@/components/ui/Registration/Submitbtn";
import AuthSwitchPrompt from "@/components/ui/Registration/AuthSwitchPrompt";
import styles from "./Css/Registrtion.module.css";
import React from "react";
import Swal from "sweetalert2";
import { supabase } from "../SupabaseConnection";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
export interface UserDataType {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}
const Registration: React.FC = () => {
  const navigate = useNavigate();
  const UserData = useRef<UserDataType>({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { username, email, password, confirmpassword } = UserData.current;
      if (!username || !email || !password || !confirmpassword) {
        Swal.fire({
          icon: "error",
          title: "All fields are required",
          text: "Please fill out all the fields before submitting the form.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }

      if (password !== confirmpassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "The password and confirm password fields do not match. Please try again.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const response = await supabase.from('Users').select('*').eq('email',email).single();
      const existinguser = response.data;
      if(existinguser){
         Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "This email is already in use. Please log in or use a different email.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Swal.fire({
          icon: "error",
          text: `${error.message}`,
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const res = await supabase.from('Users').insert({id:data.user.id,username:username,email:data.user.email}).select()
      if(res.data){
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your Account Has been Successfully Created",
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then((result)=>{
          if(result.isConfirmed){
            navigate("/Login")
          }
        });
      }
    } catch (error) {
      Swal.fire({
          icon: "error",
          title:"Something Went Wrong",
          text: `${error.message}`,
          confirmButtonColor: "rgb(22, 163, 74)",
        });
    }
  };
  return (
    <div className={styles.registrationcontainer}>
      <div className={styles.registrationcard}>
        <AccountHeader
          HeaderHeading="Create Account"
          HeaderText="Join our platform to access exclusive features"
        />
        <form className={styles.registrationform} onSubmit={handleSubmitbutton}>
          <RegistrationForm UserData={UserData} />
          <Submitbtn btntext="Create Account" />
          <Divider />
          <AuthSwitchPrompt
            text="Already have an account?"
            link="Log in"
            redirectTo="/Login"
          />
        </form>
      </div>
    </div>
  );
};

export default Registration;
