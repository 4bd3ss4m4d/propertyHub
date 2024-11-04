import React, { useState } from "react";
import axios from "axios";
import '../assets/styles/create.css';
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";
import TextFieldsAndCheckbox from "../components/TextFieldsAndCheckbox";
import ImageUpload from "../components/ImageUpload";
import Footer from "../components/Footer";
import axiosWithHeader from "../services/axios";
import { useNavigate } from "react-router-dom";

export default function Create() { 

  const { currentUser } = useSelector((state) => state.user); // Access the logged-in user  
  const navigate = useNavigate()

  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    title: '',
    description: '',
    propertyType: '',
    agentId: currentUser.id,
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
    images: [], // Placeholder for image URLs after upload
    phoneNumber: '',
    status: 'Available', // Default status
    isFeatured: false, // Track if the listing is featured
  });

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

    // Convert numeric values before submitting
    const formattedData = {
      ...data,
      price: Number(data.price), // Convert price to a number
      size: Number(data.size),  
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      rooms: Number(data.rooms),
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
      ...formattedData, // Use the formatted data with correct types
      images: imageUrls, // Add uploaded image URLs
      offerType: data.offerType.charAt(0).toUpperCase() + data.offerType.slice(1), // Capitalize offerType
    };
    console.log("Property listing created successfully", updatedData);

    // Send the data to the backend with JWT token in headers
    try {
      await axiosWithHeader.post(`/api/properties`, updatedData)
      .then((response)=>{
        alert("Lesting created successfully.")
        navigate( `/listing/${response.data.data._id}`)  
        });
      
      

      

    } catch (error) {
      alert("Error creating listing; Please try again later")
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
          className="image-preview" // Added class for image preview styling
          style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }}
        />
      );
    });
  };

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
