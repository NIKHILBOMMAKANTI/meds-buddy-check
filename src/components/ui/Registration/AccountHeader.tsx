
import style from './Css/AccountHeader.module.css';
import React from 'react';
interface AccountHeaderProps {
    HeaderHeading:string,
    HeaderText:string,
}
const AccountHeader:React.FC<AccountHeaderProps> = ({HeaderHeading,HeaderText})=>{
    return(
        <div className={style.cardheader}>
          <h1>{HeaderHeading}</h1>
          <p>{HeaderText}</p>
        </div>
    );
}
export default AccountHeader