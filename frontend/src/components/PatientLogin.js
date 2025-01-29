import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorLogin.css";

const PatientLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API_URL = "http://localhost:5008";
    const clientId = "934186764034-hob9fe241h4ltkql4j3dukl8h8qc5pa0.apps.googleusercontent.com";

    // ✅ Handle Google Login
    const handleGoogleSuccess = async (response) => {
        if (!response.credential) {
            console.error("Google login failed: No credential received");
            return;
        }

        const googleToken = response.credential;
        console.log("Google Token Received:", googleToken);

        try {
            const res = await fetch(`${API_URL}/loginPatient/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: googleToken })
            });

            const data = await res.json();
            console.log("Backend Response:", data);

            if (res.ok) {
                localStorage.setItem("patientToken", data.token);
                localStorage.setItem("patientInfo", JSON.stringify(data.patient)); 
                navigate("/doctor-search", { state: { patient: data.patient } }); 
            } else {
                console.error("Google Login Failed:", data.message);
                setError(data.message || "Google Login Failed");
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            setError("Google Authentication Failed");
        }
    };

    // ✅ Handle Manual Login
    const handleManualLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/loginPatient/manual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("patientToken", data.token);
                localStorage.setItem("patientInfo", JSON.stringify(data.patient));
                navigate("/doctor-search", { state: { patient: data.patient } });
            } else {
                setError(data.message || "Invalid Credentials");
            }
        } catch (err) {
            console.error("Manual Login Error:", err);
            setError("Server Error. Please try again.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="login-container">
                <h2>Patient Login</h2>

                {error && <p className="error">{error}</p>}

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

                <p>Don't have an account? <button onClick={() => navigate("/patient-register")}>Register</button></p>
            </div>
        </GoogleOAuthProvider>
    );
};

export default PatientLogin;
