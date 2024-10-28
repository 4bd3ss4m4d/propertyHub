import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

// Lazy loading the components
const Home = lazy(() => import("./pages/Home"));
const FAQ = lazy(() => import("./pages/FAQ"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AuthSuccess = lazy(() => import("./pages/AuthStatus").then(module => ({ default: module.AuthSuccess })));
const AuthFailure = lazy(() => import("./pages/AuthStatus").then(module => ({ default: module.AuthFailure })));
const Profile = lazy(() => import("./pages/Profile"));
const Create = lazy(() => import("./pages/Create"));
const ShowListing = lazy(() => import("./pages/ShowListing"));
const MyListing = lazy(()=> import("./pages/MyListing"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/success" element={<AuthSuccess type="SignUp" />} /> 
          <Route path="/signup/failure" element={<AuthFailure type="SignUp" />} /> 
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin/success" element={<AuthSuccess type="SignIn" />} /> 
          <Route path="/signin/failure" element={<AuthFailure type="SignIn" />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/create" element={<Create />} /> 
          <Route path="/listing/:id" element={<ShowListing />} />
          <Route path="/my-listing" element={<MyListing />} /> 
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
