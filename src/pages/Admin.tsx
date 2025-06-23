import React from "react";
import AdminHeader from "@/components/ui/Admin/AdminHeader";
import EnrollPatient from "@/components/ui/Admin/EnrollPatient";
import Patientsection from "@/components/ui/Admin/Patientsection";
import styles from "./Css/Admin.module.css";
import { useParams } from "react-router-dom";
import { useRef,useEffect,useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/SupabaseConnection";
export interface PatientDataType {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}
const AdminDashboard: React.FC = () => {
  const caretakerid = useParams();
  const id = caretakerid.id;
  const [user,setUser] = useState<string>("Dr. Sarah Johnson");
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await supabase.from('Users').select('*').eq('id',id).single();
      const username = response.data['username'];
      setUser(username);
    }
    fetchData();
  },[])


  const PatientData = useRef<PatientDataType>({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const handleSubmitbutton = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { username, email, password, confirmpassword } =
        PatientData.current;
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
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Swal.fire({
          icon: "error",
          text: `${error.message}`,
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      if (!data?.user) {
        Swal.fire({
          icon: "error",
          title: "Registration Error",
          text: "User data was not returned. Please try again.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return;
      }
      const res = await supabase
        .from("Users")
        .insert({
          id: data.user.id,
          username: username,
          email: data.user.email,
          role: "patient",
          assignee:`${id}`
        })
        .select();
      console.log(res.data);
      if (res.data) {
        Swal.fire({
          icon: "success",
          title: "Patient Account Created",
          text: "The patient's account has been successfully created and is ready for use.",
          confirmButtonColor: "rgb(22, 163, 74)",
        }).then((result)=>{
          if(result.isConfirmed){
            window.location.reload();
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: `${error.message}`,
        confirmButtonColor: "rgb(22, 163, 74)",
      });
    }
  };
  return (
    <div className={styles.admindashboard}>
      {user && <AdminHeader user={user}/>}
      <div className={`${styles.container} ${styles.maincontent} mt-5`}>
        <div className={styles.dashboardgrid}>
          <EnrollPatient
            PatientData={PatientData}
            handleSubmitbutton={handleSubmitbutton}
          />
          <Patientsection caretakerid={id}/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
