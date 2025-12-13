import React from 'react';
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom"
import SignUpPage from "./Pages/SignUpPage"
import SignInPage from './Pages/SignInPage';
import ImageResizePage from './Pages/ImageResizePage';
import HomePage from './Pages/HomePage';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/signin" element={<SignInPage/>} />
          <Route path="/" element={<HomePage/>} />
          <Route path="/edit/resize-image" element={<ImageResizePage/>} />
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
