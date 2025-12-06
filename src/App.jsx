import React from 'react';
import { Navigate, Routes, Route } from "react-router-dom"
import SignUpPage from "./Pages/SignUpPage"
import SignInPage from './Pages/SignInPage';

const App = () => {
  return (
    <>
        <Routes>
          <Route path="/auth/signup" element={<SignUpPage/>} />
          <Route path="/auth/signin" element={<SignInPage/>} />
          <Route path="*" element={<Navigate to="/auth/signup" />} />
        </Routes>
    </>
  )
}

export default App
