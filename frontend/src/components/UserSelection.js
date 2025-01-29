import { useNavigate } from "react-router-dom";
import "../styles/userSelection.css";


const UserSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="selection-container">
            <h1>Are you a Doctor or a Patient?</h1>
            <button onClick={() => navigate("/doctor-login")}>Doctor</button>
            <button onClick={() => navigate("/patient-login")}>Patient</button>
        </div>
    );
};

export default UserSelection;
