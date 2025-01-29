import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const DoctorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const clientId = "624117525458-egh8rn7dn30tcdfennek3l9rkff5coln.apps.googleusercontent.com";
    const backendURL = "http://localhost:5008"; 

    // Handle Manual Login
    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendURL}/api/auth/doctor/login`, { email, password });
            
            const doctorInfo = res.data.doctor; 
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo)); 
            alert("Login successful!");
            navigate("/doctor-search", { state: { doctor: doctorInfo } }); 
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        }
    };

    // Handle Google Login Success
    const handleGoogleSuccess = async (response) => {
        try {
            const { credential } = response;
            const res = await axios.post(`${backendURL}/api/auth/google`, { token: credential });
            
            const doctorInfo = res.data.doctor;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
            alert("Google login successful!");
            navigate("/doctor-search", { state: { doctor: doctorInfo } }); 
        } catch (err) {
            setError("Google login failed. Please try again.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container">
                <h2>Doctor Login</h2>

                {error && <p className="error">{error}</p>}

                {/* 🔹 Manual Login Form */}
                <form onSubmit={handleManualLogin} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button type="submit">Login</button>
                </form>

                <div className="divider">OR</div>

                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Login Failed")} />

                <p>
                    Don't have an account? <button onClick={() => navigate("/doctor-register")}>Register</button>
                </p>
            </div>
        </GoogleOAuthProvider>
    );
};

export default DoctorLogin;
