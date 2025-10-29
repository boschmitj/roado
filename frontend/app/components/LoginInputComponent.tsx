import React from "react";
import "./LoginInputComponent.css"
interface InputProps {
    id : string;
    type?: "text" | "email" | "password";
    required? : boolean; 
    text : string;
    onChange : React.ChangeEventHandler<HTMLInputElement>;
    value : string;
}

const LoginInputComponent : React.FC<InputProps> = ({id, type="text", required=false, text, onChange, value}) => {
    return (
        
        <div className="group"> 
            <input type={type} id={id} required={required} onChange={onChange} value={value}/>
            <label htmlFor={id}>{text}</label>
            <div className="bar"></div>
        </div>
        
    )
}

export default LoginInputComponent;