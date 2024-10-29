import React, { useEffect } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import axiosWithHeader from '../services/axios';

function MyListing() {
    const {currentUser} = useSelector(state=> state.user);
    const user = currentUser._id;
    useEffect(()=>{
        axiosWithHeader(`{import.meta.env.VITE_API_URL}/properties/${user}`)
        .then(response=>console.log(response))
        
    }, [])    
  return (
    <>
    <Navbar />
    <div> those are my ListingMyListing</div>
    <Footer />
    </>
  )
}

export default MyListing