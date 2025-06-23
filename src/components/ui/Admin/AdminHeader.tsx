import styles from './Css/AdminHeader.module.css'
import React from 'react';
interface userProp {
  user:string;
}
const AdminHeader:React.FC<userProp> = (user)=>{
    return(
        <header className={styles.dashboardheader}>
        <div className="container">
          <div className={styles.headercontent}>
            <div className={styles.logo}>
              <div className={styles.logoicon}>
                <i className="fas fa-heartbeat"></i>
              </div>
              <div>
                <h1>CareTaker</h1>
                <p>Patient Management System</p>
              </div>
            </div>
            <div className={styles.userinfo}>
              <div className={styles.userdetails}>
                <span className={styles.username}>{user.user}</span>
                <span className={styles.userrole}>Head Caretaker</span>
              </div>
              <div className={styles.useravatar}>
                <i className="fas fa-user-md"></i>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
}
export default AdminHeader