import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import "../styles/doctorRegister.css";

const specializations = [
    { name: "Kadın Hastalıkları Ve Doğum", category: "Uzmanlık" },
    { name: "Psikoloji" },
    { name: "Kulak Burun Boğaz" },
    { name: "Genel Cerrahi" },
    { name: "Ortopedi Ve Travmatoloji" }
];

const API_URL = "http://localhost:5008";
const clientId = "934186764034-hob9fe241h4ltkql4j3dukl8h8qc5pa0.apps.googleusercontent.com";

const cities = {
    "İzmir": ["Bornova", "Karşıyaka", "Konak"],
    "İstanbul": ["Beşiktaş", "Kadıköy", "Şişli"],
    "Ankara": ["Çankaya", "Keçiören", "Mamak"]
};

const DoctorRegister = () => {
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        specialization: "",
        availableDays: [],
        availableHours: { start: "", end: "" },
        address: "",
        city: "",
        town: ""
    });

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle checkboxes
    const handleCheckboxChange = (day) => {
        const updatedDays = formData.availableDays.includes(day)
            ? formData.availableDays.filter(d => d !== day)
            : [...formData.availableDays, day];

        setFormData({ ...formData, availableDays: updatedDays });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Registration Successful! Redirecting to login...");
            navigate("/doctor-login"); 
        } else {
            alert("Error in Registration");
        }
    };

    // ✅ Google Authentication Success Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            
            const response = await fetch(`${API_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            if (response.ok) {
                setFormData({
                    ...formData,
                    email: decoded.email,
                    fullName: decoded.name
                });
            } else {
                console.error("Google Authentication Failed");
            }
        } catch (error) {
            console.error("Google Authentication Failed", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}> 
            <div className="register-container">
                <h2>ADD ME AS DOCTOR</h2>

                {/* ✅ Google Authentication */}
                <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                />

                <form onSubmit={handleSubmit} className="register-form">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} disabled />

                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

                    <label>Area of Interest</label>
                    <select name="specialization" onChange={handleChange} required>
                        <option value="">Select Specialization</option>
                        {specializations.map((spec, index) => (
                            <option key={index} value={spec.name}>{spec.name}</option>
                        ))}
                    </select>

                    <label>Available Days</label>
                    <div className="checkbox-group">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                            <label key={day}>
                                <input 
                                    type="checkbox" 
                                    checked={formData.availableDays.includes(day)}
                                    onChange={() => handleCheckboxChange(day)} 
                                />
                                {day}
                            </label>
                        ))}
                    </div>

                    <label>Available Hours</label>
                    <div className="time-inputs">
                        <input type="time" name="availableHours.start" onChange={handleChange} required />
                        <input type="time" name="availableHours.end" onChange={handleChange} required />
                    </div>

                    <label>Address</label>
                    <input type="text" name="address" onChange={handleChange} required />

                    <label>City</label>
                    <select name="city" onChange={handleChange} required>
                        <option value="">Select City</option>
                        {Object.keys(cities).map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <label>Town</label>
                    <select name="town" onChange={handleChange} disabled={!formData.city} required>
                        <option value="">Select Town</option>
                        {formData.city && cities[formData.city].map(town => (
                            <option key={town} value={town}>{town}</option>
                        ))}
                    </select>

                    <button type="submit">REGISTER</button>
                </form>
            </div>
        </GoogleOAuthProvider>
    );
};

export default DoctorRegister;
