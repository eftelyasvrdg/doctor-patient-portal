import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/DoctorSearch.css";

const API_URL = "http://localhost:5008";

const SearchResults = () => {
    const location = useLocation();
    const searchParams = location.state || {};
    const [query, setQuery] = useState(searchParams.query || "");
    const [city, setCity] = useState(searchParams.location || "İzmir");

    const [doctors, setDoctors] = useState([]);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("patientInfo")) || null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/doctors/search?q=${query}&location=${city}`);
                if (response.data.doctors.length === 0) {
                    setError("Sonuç bulunamadı.");
                } else {
                    setDoctors(response.data.doctors);

                    const reviewsData = {};
                    for (const doctor of response.data.doctors) {
                        const reviewResponse = await axios.get(`${API_URL}/api/reviews/doctor/${doctor.id}`);
                        reviewsData[doctor.id] = reviewResponse.data;
                    }
                    setReviews(reviewsData);
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
                setError("Doktorları yüklerken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        if (query.length >= 2) fetchDoctors();
    }, [query, city]);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/doctors/autocomplete?q=${query}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching autocomplete:", error);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
    };

    const handleViewDoctor = async (doctor) => {
        if (!user) {
            alert("Yorum yapabilmek ve randevu almak için giriş yapmalısınız.");
            return;
        }

        // Notify the backend about an incomplete appointment
        await axios.post(`${API_URL}/api/notifications/incomplete`, {
            email: user.email,
            doctorName: doctor.full_name,
        });

        window.location.href = `/doctor/${doctor.id}`;
    };

    const handleReviewSubmission = async (doctorId, rating, comment) => {
        try {
            await axios.post(`${API_URL}/api/reviews/submit`, {
                doctor_id: doctorId,
                patient_id: user?.id || 1,
                rating,
                comment,
            });

            const updatedReviews = await axios.get(`${API_URL}/api/reviews/doctor/${doctorId}`);
            setReviews((prev) => ({ ...prev, [doctorId]: updatedReviews.data }));
            alert("Yorum başarıyla gönderildi.");
        } catch (error) {
            alert("Yorum gönderilemedi.");
        }
    };

    return (
        <div className="results-container">
            <div className="results-header">
                <h3>Doktor Ara</h3>
                <input
                    type="text"
                    placeholder="Doktor adı veya uzmanlık alanı"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                {suggestions.length > 0 && (
                    <ul className="autocomplete-list">
                        {suggestions.map((item, index) => (
                            <li key={index} onClick={() => handleSelectSuggestion(item.full_name)}>
                                {item.full_name} - {item.specialization}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="doctor-info">
                                <div>
                                    <h4>{doctor.full_name}</h4>
                                    <p>{doctor.specialization}</p>
                                    <p>{doctor.city}</p>
                                    <p>
                                        ⭐{" "}
                                        {reviews[doctor.id] && reviews[doctor.id].length > 0
                                            ? (
                                                  reviews[doctor.id].reduce((sum, r) => sum + r.rating, 0) /
                                                  reviews[doctor.id].length
                                              ).toFixed(1)
                                            : "Henüz yorum yok"}{" "}
                                        ({reviews[doctor.id]?.length || 0})
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleViewDoctor(doctor)} className="view-doctor-button">
                                Doktor Profili
                            </button>
                            <div className="review-section">
                                <h5>Yorum Yap</h5>
                                <select
                                    onChange={(e) => handleReviewSubmission(doctor.id, e.target.value, "")}
                                >
                                    <option value="">⭐ Derecelendirme</option>
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} Yıldız
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    placeholder="Görüşlerinizi buraya ekleyin..."
                                    onBlur={(e) =>
                                        handleReviewSubmission(doctor.id, 5, e.target.value)
                                    }
                                ></textarea>
                            </div>
                        </div>
                    ))}
                    <div className="map-container">
                        <LoadScript googleMapsApiKey="AIzaSyBAaYDx5l5OTNGC-qWyo4VCwhpuygOhuAo">
                            <GoogleMap
                                mapContainerClassName="google-map"
                                center={{ lat: 38.4192, lng: 27.1287 }}
                                zoom={12}
                            >
                                {doctors.map((doctor) => (
                                    <Marker
                                        key={doctor.id}
                                        position={{ lat: doctor.lat, lng: doctor.lng }}
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchResults;
