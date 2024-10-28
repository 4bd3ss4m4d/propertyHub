import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import '../assets/styles/profile.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import axios from "axios";
import { SignOut } from "../services/authServices";
import Footer from "../components/Footer";


export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [updateData, setUpdateData] = useState({
        id: currentUser ? currentUser.id : '',
        username: currentUser ? currentUser.username : '',
        email: currentUser ? currentUser.email : '',
        password: '', // Initially empty, filled when user enters a new password
    });

    const [toggle, setToggle] = useState(false); // Toggle for expanding profile section
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const imageUpdate = useRef(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/signin"); // Redirect to signin if currentUser is not set
        }
    }, [currentUser, navigate]);

    const handleUpdate = (e) => {
        const { name, value } = e.target;
        setError('');

        if (value.trim() === '') return; // Prevent empty updates

        setUpdateData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!updateData.username || !updateData.email) {
            setError('Username and Email are required fields.');
            return;
        }

        if (updateData.password && updateData.password !== updateData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setError('');
            setLoading(true);

            const response = await axios.put('/api/update-profile', updateData);
            console.log('Profile updated:', response.data);

        } catch (error) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const navigateateToCreate = () => {
        navigate('/create')
    }

    const handleToggle = () => {
        setToggle(!toggle); // Toggle expand/collapse
    };

    const handleSignout = async () => {
        try {
          await SignOut();
        } catch (error) {
          console.error('Error during sign-out navigation:', error);
        }
      };

    const ShowListing = ()=>{
        navigate('/my-listing')
    }

    return (
        <>
            {currentUser && (
                <>
                    <Navbar />
                    <div className="profile">
                        <img
                            src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
                            alt="User Avatar"
                            onClick={() => imageUpdate.current.click()}
                        />
                        <div className="setting">
                            <input
                                type="file"
                                accept="image/*"
                                name="avatar"
                                style={{ display: 'none' }}
                                ref={imageUpdate}
                                onChange={handleUpdate}
                            />

                            {/* Profile button */}
                            <button className="profile-toggle-btn" onClick={handleToggle}>
                                Profile
                            </button>

                            {/* Show profile info if toggle is true */}
                            {toggle && (
                                <div className="profile-info">
                                    <h4>{error}</h4>
                                    <label htmlFor="username">Change Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={updateData.username}
                                        onChange={handleUpdate}
                                    />

                                    <label htmlFor="email">Change Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={updateData.email}
                                        onChange={handleUpdate}
                                    />

                                    <label htmlFor="password">Change Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="New Password"
                                        onChange={handleUpdate}
                                    />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        onChange={handleUpdate}
                                    />

                                    <button
                                        className="upating-profile"
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="profile-toggle-btn" onClick={navigateateToCreate}>Create Listing</button>
                        <button className="profile-toggle-btn" onClick={ShowListing}>Show My Listing</button>
                        <button className="profile-toggle-btn" onClick={handleSignout}>Sign Out</button>
                    </div>
                </>
            )}

            <Footer />
        </>
    );
}
