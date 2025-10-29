import React, { useState } from "react";
import LoginInputComponent from "./LoginInputComponent";
import "./LoginComponent.css"
import Button from "./Button";

const LoginComponent : React.FC = () => {

    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nickname: ""
    });
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        console.log(id, ": ",value);
        setFormData(prev => ({
            ...prev, 
            [id]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignUp) {
            try {
                const registerUser: RegisterUserDTO = formData;
                console.log(registerUser);
                // const response = await fetch(`http://localhost:8080/auth/signup`, {
                //     method: "POST",
                //     body: JSON.stringify(registerUser),
                // });
            } catch (error) {
                
            }
        } else {
            try {
                const email : string = formData.email;
                const password : string = formData.password;
                const loginUser : LoginUserDTO = {
                    email,
                    password,
                };
                console.log(loginUser);
                // const response = await fetch("http://localhost:8080/auth/login", {
                //     method: "POST",
                //     body: JSON.stringify(loginUser),
                // });
            } catch (error) {

            }
        }
        
    }

    return (
        <div className="login-container centered">
            <div className="heading__login">
                <h2>{isSignUp ? "Sign up" : "Sign in"} here</h2>
            </div>
            <div className={`toggle-buttons__login ${isSignUp ? "sign-up-active" : "sign-in-active"}`}>
                <div className="highlight-bar"></div>
                <Button
                    variant={!isSignUp ? "primary" : "secondary"}
                    onClick={() => setIsSignUp(false)}
                >
                    Sign In
                </Button>
                <Button
                    variant={isSignUp ? "primary" : "secondary"}
                    onClick={() => setIsSignUp(true)}
                >
                    Sign Up
                </Button>
            </div>
            
            
            <form onSubmit={handleSubmit} className="login-form">
                {isSignUp && (
                    <LoginInputComponent id="nickname" type="text" required text="Nickname" onChange={handleChange} value={formData.nickname}/>
                )}
                <LoginInputComponent id="email" type="email" required text="Email" onChange={handleChange} value={formData.email}/>
                <LoginInputComponent id="password" type="password" required text="Password" onChange={handleChange} value={formData.password}/>   

                <Button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button> 
            </form>
        </div>
    )
}

interface LoginUserDTO {
    email: string;
    password: string;
}

interface RegisterUserDTO extends LoginUserDTO {
    nickname: string;
}



const handleSubmit = async (isSignUp : boolean) => {
    if (isSignUp) {
        try {
            const response = await fetch(`http://localhost:8080/auth/signup`)
        } catch (error) {

        }
    }
    
}


export default LoginComponent;