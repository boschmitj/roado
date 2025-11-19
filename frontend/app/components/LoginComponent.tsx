"use client";
import React, { useEffect, useState } from "react";
import LoginInputComponent from "./LoginInputComponent";
import "./LoginComponent.css";
import "../styles/googleButton.css";
import Button from "./Button";
import axios from "../api/axios";

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
                const response = await axios.post("http://localhost:8080/auth/register", JSON.stringify(registerUser));
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
                const response = await axios.post("http://localhost:8080/auth/login", JSON.stringify(loginUser));
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

                <Button id="submit-button" type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button> 
            </form>

            <button className="gsi-material-button" 
                onClick={() => {
                    window.location.href = "http://localhost:8080/oauth2/authorization/google";
                }}
                >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                </div>
                <span className="gsi-material-button-contents">Continue with Google</span>
                <span style={{display : "none"}}>Continue with Google</span>
            </div>
            </button>

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


export default LoginComponent;