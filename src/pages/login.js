import "../style/signup.css"
import { MdMail, MdVpnKey } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigate = useNavigate();

    async function verifyUser(user) {
        try {
          const response = await axios.post("http://localhost:8000/users/login", user);
          return response;
        } catch (error) {
          if (error.response && error.response.data) {
            // Return the backend error message
            return { status: error.response.status, error: error.response.data.error };
          }
          console.error(error);
          return { status: 500, error: "An unexpected error occurred" };
        }
    
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        verifyUser({
            email: email,
            password: password
        }).then( result => {
            if (result.status === 200) {
                console.log('Log in successful!');
                navigate("/contacts");
            }
            else {
                // Display the error message
                console.error("Error:", result.error);
                if (result.error === "Email does not have an account") {
                    setEmailError(true);
                }
                if (result.error === "Incorrect Password") {
                    setPasswordError(true);
                }
            }
        })
    };

    return(
        <div className="container">
            <form className="login" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-container">
                    <MdMail className="icon" />
                    <input 
                        type="email" 
                        placeholder="Email"  
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            borderColor: emailError ? 'red' : 'initial',
                        }}
                    />
                </div>

                {emailError && (
                    <div className="error-message" style={{ color: 'red' }}>Email does not have an account</div>
                )}

                <div className="input-container">
                    <MdVpnKey className="icon" />
                    <input 
                        type="password" 
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            borderColor: passwordError ? 'red' : 'initial',
                        }}
                    />
                </div>

                {passwordError && (
                    <div className="error-message" style={{ color: 'red' }}>Incorrect password</div>
                )}

                <div className="login-links">
                    <Link to="/forgot-password" className="link">Forgot password?</Link>
                    <Link to="/signup" className="link">Don’t have an account? Sign up</Link>
                </div>
                <button type="submit" className="btn">Login</button>
                
            </form>
        </div>
    )
}