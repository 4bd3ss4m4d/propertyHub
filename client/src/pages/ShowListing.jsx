import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
import Slider from "react-slick";
import { FaParking, FaWifi, FaPaw, FaBed, FaBath } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/styles/showListing.css';
import axiosWithHeader from '../services/axios';
import { useSelector } from 'react-redux';

export default function ShowListing() {
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchListing = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/properties/${id}`);
                if (isMounted) {
                    setListing(response.data.data);
                    setIsOwner(response.data.data.userId === currentUser._id); // Check if the current user is the owner
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
                navigate("/404page");
            }
        };

        fetchListing();

        return () => {
            isMounted = false;
        };
    }, [id, navigate, currentUser]);

    if (!listing) return <p>Loading...</p>;

    // Settings for react-slick
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: 'ondemand',
    };

    const showContact = (phone) => {
        alert(`Contact: ${phone}`);
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                const response = await axiosWithHeader.delete(`/api/properties/${id}`);
                if (response.data.success) {
                    alert('Listing deleted successfully.');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error deleting listing:', error);
                alert('There was an error deleting the listing.');
            }
        }
    }

    return (
        <>
            <Navbar />
            {isOwner && (
                <div className='additional-buttons'>
                    <button className='editing-listing'>EDIT</button>
                    <button onClick={handleDelete} className='delete-listing'>DELETE</button>
                </div>
            )}
            <div className="property-container">
                <div className="property-card">
                    <Slider {...sliderSettings}>
                        {listing.images.map((img, index) => (
                            <div key={index}>
                                <img src={img} alt={listing.title} className="property-image" />
                            </div>
                        ))}
                    </Slider>
                    
                    <div className="property-details">
                        <h2 className="property-title">{listing.title}</h2>
                        <p className="property-description">{listing.description}</p>
                        <p className="property-location">
                            {listing.address.street}, {listing.address.city}, {listing.address.state}, {listing.address.zipCode}, {listing.address.country}
                        </p>

                        <div className="property-features">
                            <p><FaParking /> {listing.parking ? 'Parking Available' : 'No Parking'}</p>
                            <p><FaWifi /> {listing.wifi ? 'Wi-Fi Available' : 'No Wi-Fi'}</p>
                            <p><FaPaw /> {listing.petFriendly ? 'Pet-Friendly' : 'No Pets'}</p>
                            <p><FaBed /> {listing.bedrooms} Bedrooms</p>
                            <p><FaBath /> {listing.bathrooms} Bathrooms</p>
                            <p>Year Built: {listing.yearBuilt}</p>
                            <p>Size: {listing.size} sqft</p>
                        </div>
                        <h2 className="property-price">${listing.price}</h2>
                    </div>
                    <div className='datepicker-container'>
                        <button className='booking-button' onClick={() => showContact(listing.phoneNumber)}>
                            Inquire now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
