import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserSelection from "./components/UserSelection";
import DoctorLogin from "./components/DoctorLogin";
import DoctorRegister from "./components/DoctorRegister";
import DoctorSearch from "./components/DoctorSearch"; 
import SearchResults from "./components/SearchResults";
import PatientLogin from "./components/PatientLogin"; 
import PatientRegister from "./components/PatientRegister"; 


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<UserSelection />} />
                <Route path="/doctor-login" element={<DoctorLogin />} />
                <Route path="/doctor-register" element={<DoctorRegister />} />
                <Route path="/doctor-search" element={<DoctorSearch />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/patient-login" element={<PatientLogin />} />
                <Route path="/patient-register" element={<PatientRegister />} />
                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
