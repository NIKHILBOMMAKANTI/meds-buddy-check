import styles from './Css/Divider.module.css'
import React from 'react';
const Divider:React.FC = ()=>{
    return(
        <div className={styles.divider}>
            <span>or</span>
          </div>
    );
}
export default Divider