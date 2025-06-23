import style from './Css/RegistrationForm.module.css'
import React from 'react';
import { UserDataType } from '@/pages/Registration';

interface RegistrationFormProps  {
 UserData:React.RefObject<UserDataType>
 
}

const RegistrationForm: React.FC<{UserData:React.RefObject<RegistrationFormProps>}> = ({UserData}) => {
  console.log(UserData);
  return (
    <>
      <div className={style.inputgroup}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter Your UserName" className={style.input} onChange={(e)=>UserData.current['username'] = e.target.value}/>
      </div>

      <div className={style.inputgroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter Your Email" className={style.input} onChange={(e)=>UserData.current['email'] = e.target.value}/>
      </div>

      <div className={style.inputgroup}>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="••••••••" className={style.input} onChange={(e)=>UserData.current['password'] = e.target.value}/>
      </div>

      <div className={style.inputgroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" className={style.input} onChange={(e)=>UserData.current['confirmpassword'] = e.target.value}/>
      </div>
    </>
  );
};
export default RegistrationForm;
