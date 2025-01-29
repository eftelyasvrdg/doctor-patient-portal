import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/DoctorSearch.css";

const specializations = [
    { name: "Kadın Hastalıkları Ve Doğum", category: "Uzmanlık" },
    { name: "Psikoloji", category: "Uzmanlık" },
    { name: "Kulak Burun Boğaz", category: "Uzmanlık" },
    { name: "Genel Cerrahi", category: "Uzmanlık" },
    { name: "Ortopedi Ve Travmatoloji", category: "Uzmanlık" }
];

const cities = ["İzmir", "İstanbul", "Ankara"];

const DoctorSearch = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("İzmir");
    const [filteredSpecializations, setFilteredSpecializations] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const navigate = useNavigate();

    const locationState = useLocation();
    const doctor = locationState.state?.doctor || JSON.parse(localStorage.getItem("doctorInfo"));
    const patient = locationState.state?.patient || JSON.parse(localStorage.getItem("patientInfo"));
    const user = doctor || patient; // Get the logged-in user

    useEffect(() => {
        if (query.length > 0) {
            const filtered = specializations.filter(spec =>
                spec.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSpecializations(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        if (query.length > 2) {
            navigate(`/search-results`, {
                state: { query, location, user }
            });
        }
    };

    return (
        <div className="search-container">
            <div className="search-header">
                <h2>DoktorTakvimi</h2>

                {/* Display logged-in user info */}
                {doctor && <p>Hoş geldiniz, Dr. {doctor.full_name}!</p>}
                {patient && <p>Hoş geldiniz, {patient.full_name}!</p>}

                <div className="search-box">
                    <div className="search-input" ref={suggestionsRef}>
                        <input
                            type="text"
                            placeholder="Uzmanlık, ilgi alanı ve hastalık, isim"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        {showSuggestions && (
                            <div className="suggestions-dropdown">
                                {filteredSpecializations.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => {
                                            setQuery(spec.name);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <span className="icon">📁</span>
                                        <div className="suggestion-details">
                                            <p className="suggestion-title">{spec.name}</p>
                                            <p className="suggestion-category">{spec.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <select 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="city-dropdown"
                    >
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleSearch}>🔍 Ara</button>
                </div>
            </div>
        </div>
    );
};

export default DoctorSearch;
