import style from './Css/Link.module.css'
import React from 'react';
import { Link } from 'react-router-dom';
interface LinkProps {
    text:string,
    link:string,
    redirectTo:string
}
const AuthSwitchPrompt:React.FC<LinkProps> = ({text,link,redirectTo})=>{
    return(
        <Link to={redirectTo}>
        <div className={style.loginlink}>
            {text}<a href="#">{link}</a>
          </div>
        </Link>
    );
}
export default AuthSwitchPrompt