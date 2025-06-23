import styles from './Css/Submitbtn.module.css'
import React from 'react';
interface SubmitBtnProps  {
    btntext:string;
}
const Submitbtn:React.FC<SubmitBtnProps> = ({btntext})=>{
    return(
        <button type="submit" className={styles.submitbtn}>
            {btntext}
        </button>
    );
}
export default Submitbtn