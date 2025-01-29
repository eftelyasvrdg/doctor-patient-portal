import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorLogin.css"; 

const PatientRegister = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API_URL = "http://localhost:5008";
    const clientId = "934186764034-hob9fe241h4ltkql4j3dukl8h8qc5pa0.apps.googleusercontent.com";

    // ✅ Handle Google Registration
    const handleGoogleSuccess = async (response) => {
        if (!response.credential) {
            console.error("Google registration failed: No credential received");
            return;
        }

        const googleToken = response.credential;
        console.log("Google Token Received:", googleToken);

        try {
            const res = await fetch(`${API_URL}/api/patients/loginPatient/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: googleToken })
            });

            const data = await res.json();
            console.log("Backend Response:", data);

            if (res.ok) {
                localStorage.setItem("patientToken", data.token);
                navigate("/patient-dashboard");
            } else {
                setError(data.message || "Google Registration Failed");
            }
        } catch (err) {
            setError("Google Authentication Failed");
        }
    };

    // ✅ Handle Manual Registration
    const handleManualRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/api/patients/registerPatient`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("patientToken", data.token);
                navigate("/patient-dashboard");
            } else {
                setError(data.message || "Registration Failed");
            }
        } catch (err) {
            console.error("Registration Error:", err);
            setError("Server Error. Please try again.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container"> 
                <h2>Patient Registration</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleManualRegister} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button type="submit">Register</button>
                </form>

                <div className="divider">OR</div>

                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Registration Failed")} />

                <p>Already have an account? <button onClick={() => navigate("/patient-login")}>Login</button></p>
            </div>
        </GoogleOAuthProvider>
    );
};

export default PatientRegister;
