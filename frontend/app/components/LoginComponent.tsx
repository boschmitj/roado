import React, { useState } from "react";
import LoginInputComponent from "./LoginInputComponent";
import "./LoginComponent.css"
import Button from "./Button";

const LoginComponent : React.FC = () => {

    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <div className="login-container centered">
            <div className="heading__login">
                <h2>{isSignUp ? "Sign up" : "Sign in"} here</h2>
            </div>
            <div className="toggle-buttons__login">
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
                    <LoginInputComponent id="nickname" type="text" required text="Nickname" />
                )}
                <LoginInputComponent id="email" type="email" required text="Email" />
                <LoginInputComponent id="password" type="password" required text="Password" />   

                <Button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button> 
            </form>
        </div>
    )
}

const handleSubmit = async () => {
    
}


export default LoginComponent;