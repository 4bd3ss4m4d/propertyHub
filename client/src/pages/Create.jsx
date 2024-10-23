import React, { useState } from "react";
import axios from "axios";
import '../assets/styles/create.css';
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
import TextFieldsAndCheckbox from "../components/TextFieldsAndCheckbox";
import ImageUpload from "../components/ImageUpload";
import Footer from "../components/Footer";
import axiosWithHeader from "../services/axios";
import { Navigate } from "react-router-dom";

export default function Create() { 
  const API_URL = import.meta.env.VITE_API_URL;
  const { currentUser } = useSelector((state) => state.user); // Access the logged-in user

  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    userId: currentUser._id,
    title: '',
    description: '',
    propertyType: '',
    price: '', // Will be converted to a number
    size: '',  // Will be converted to a number
    yearBuilt: '',
    bedrooms: '',
    bathrooms: '',
    rooms: '',
    offerType: '', // Either "Rent" or "Sale"
    wifi: false,
    petFriendly: false,
    parking: false,
    availableFrom: new Date().toISOString().slice(0, 10),
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Morocco', // Default to "Morocco" if not provided
    },
    coordinates: {
      lat: 33.5731, 
      lng: -7.5898
    },
    images: [], // Placeholder for image URLs after upload
    phoneNumber: '',
    status: 'Available', // Default status
    amenities: [], // Placeholder for amenities
    isFeatured: false, // Track if the listing is featured
  });

  const [redirect, setRedirect] = useState(false); // State for redirecting after successful submission

  // Handle file input change for image upload
  const handleFileChange = (event) => {
    setImages([...event.target.files]);
  };

  // Handle form changes (both text fields and checkboxes)
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission to send listing data and upload images
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedData = {
      ...data,
      price: Number(data.price), // Convert price to a number
      size: Number(data.size),  
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      rooms: Number(data.rooms),
      agentId: "671305e3bfbb0b7b2ffa0cbb", // Keep agentId hardcoded in submission
    };

    const formData = new FormData();
    const imageUrls = [];

    // Upload images to Cloudinary
    for (const image of images) {
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        alert("Error during uploading image");
        return;
      }
    }

    // Prepare the final data object with image URLs and ensure proper data types
    const updatedData = {
      ...formattedData,
      images: imageUrls,
      offerType: data.offerType.charAt(0).toUpperCase() + data.offerType.slice(1),
    };

    // Send the data to the backend with JWT token in headers
    try {
      await axiosWithHeader.post(`/api/properties`, updatedData);
      alert("Listing created successfully.");
      setRedirect(true); // Set redirect to true to navigate
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  // Create image previews to display selected images
  const createImagePreviews = () => {
    return Array.from(images).map((file, index) => {
      const url = URL.createObjectURL(file);
      return (
        <img
          key={index}
          src={url}
          alt={`preview ${index}`}
          className="image-preview"
          style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
        />
      );
    });
  };

  // Redirect after successful submission
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      <div className="creating-container">
        <h2>Create Property Listing</h2>
        <form className="creating" onSubmit={handleSubmit}>
          <TextFieldsAndCheckbox data={data} handleChange={handleChange} />
          <ImageUpload handleFileChange={handleFileChange} createImagePreviews={createImagePreviews} />
          <button type="submit" className="submit-btn">Create</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
