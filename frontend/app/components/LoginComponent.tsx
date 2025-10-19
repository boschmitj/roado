import React, { useState } from "react";
import LoginInputComponent from "./LoginInputComponent";
import "./LoginComponent.css"

const LoginComponent : React.FC = () => {

    const [isSignUp, setIsSignUp] = useState(true)

    return (
        <div className="login-container centered">
            <button onClick={() => setIsSignUp(false)}>Sign In</button>
            <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            <p>{isSignUp ? "Sign up" : "Sign In"} here</p>
            { isSignUp ? (
                    <form action={sendSignUp} method="post" id="signup-form">
                        <LoginInputComponent id="nickname" type="text" required text="Nickname" />
                        <LoginInputComponent id="email" type="email" required text="Email" />
                        <LoginInputComponent id="password" type="password" required text="Password" />
                    </form>
                ) : 
                (
                    <form action={sendSignIn} method="post" id="signin-form">
                        <LoginInputComponent id="email" type="email" required text="Email" />
                        <LoginInputComponent id="password" type="password" required text="Password" />
                    </form>
                )
            }
        </div>
    )
}

const sendSignUp = () => {

}

const sendSignIn = () => {

}


export default LoginComponent;