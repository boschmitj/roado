import React from "react";
import "./LoginInputComponent.css"
interface InputProps {
    id : string;
    type?: "text" | "email" | "password";
    required? : boolean; 
    text : string;
}

const LoginInputComponent : React.FC<InputProps> = ({id, type="text", required=false, text}) => {
    return (
        
        <div className="group"> 
            <input type={type} id={id} required={required}/>
            <label htmlFor={id}>{text}</label>
            <div className="bar"></div>
        </div>
        
    )
}

export default LoginInputComponent;