import "../style/login.css";
import { MdPerson, MdVpnKey, MdMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();

    const passwordRequirements = [
        { test: /[A-Z]/, message: "At least one uppercase letter" },
        { test: /[a-z]/, message: "At least one lowercase letter" },
        { test: /[0-9]/, message: "At least one number" },
        { test: /[\W_]/, message: "At least one special character" },
        { test: /.{8,}/, message: "At least 8 characters long" },
    ];

    const validatePassword = (password) => {
        return passwordRequirements.every(req => req.test.test(password));
    };

    const checkNotMatchingPassword = (password, confirmPassword) => {
        return confirmPassword && password !== confirmPassword;
    }

    async function addUser(user) {
        try {
          const response = await axios.post("http://localhost:8000/users", user);
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
        setSubmitted(true); // Mark the form as submitted

        // Check if passwords match and if password is valid
        if (password !== confirmPassword || !validatePassword(password)) {
            return; // Don't submit if passwords don't match or password is invalid
        }
        addUser({
            name: name,
            email: email,
            password: password
        }).then( result => {
            if (result.status === 201) {
                console.log('Form submitted successfully!');
                navigate("/login");
            }
            else {
                // Display the error message
                console.error("Error:", result.error);
                if (result.error === "Email is already taken") {
                    setEmailError(true);
                }
            }
        })
    };

    return (
        <div className="container">
            <form className="signup" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className="input-container">
                    <MdPerson className="icon" />
                    <input 
                        type="text" 
                        placeholder="Name"  
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-container">
                    <MdMail className="icon" />
                    <input 
                        type="email" 
                        placeholder="Email"  
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            borderColor: submitted && emailError ? 'red' : 'initial', // Highlight if invalid after submission
                        }}
                    />
                </div>

                {emailError && (
                    <div className="error-message" style={{ color: 'red' }}>Email is already taken.</div>
                )}

                <div className="input-container">
                    <MdVpnKey className="icon" />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        required 
                        style={{
                            borderColor: submitted && !validatePassword(password) ? 'red' : 'initial', // Highlight if invalid after submission
                        }}
                    />
                </div>

                {/* Display password requirements under Password field */}
                <div className="password-requirements">
                    <ul>
                        {passwordRequirements.map((req, index) => (
                            <li key={index} style={{ color: req.test.test(password) ? 'green' : 'red' }}>
                                {req.message}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="input-container">
                    <MdVpnKey className="icon" />
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        style={{
                            borderColor: submitted && checkNotMatchingPassword(password, confirmPassword) ? 'red' : 'initial', // Highlight if mismatch after submission
                        }}
                    />
                </div>

                {/* Display password mismatch error only after submission */}
                {checkNotMatchingPassword(password, confirmPassword) && (
                    <div className="error-message" style={{ color: 'red' }}>Passwords do not match.</div>
                )}

                <div className="signup-links">
                    <Link to="/login" className="link">Already have an account? Login</Link>
                </div>

                <button type="submit" className="btn">Sign Up</button>
            </form>
        </div>
    );
}
