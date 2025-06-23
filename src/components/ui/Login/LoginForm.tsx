import styles from '../Registration/Css/RegistrationForm.module.css'
import React from 'react';
import { LoginDataType } from '@/pages/Login';
interface LoginDataProp {
  LoginFormData:React.RefObject<LoginDataType>
}
const LoginForm:React.FC<LoginDataProp> = ({LoginFormData})=>{
    return(
        <>
        <div className={styles.inputgroup}>
            <label htmlFor="email">Email</label>
            <input type="email"  id="email" name="email" placeholder="Enter Your Email" required className={styles.input} onChange={(e)=>LoginFormData.current['email'] = e.target.value}/>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input  type="password" id="password" name="password" placeholder="••••••••" required className={styles.input} onChange={(e)=>LoginFormData.current['password'] = e.target.value}/>
          </div>
          </>
    );
}
export default LoginForm