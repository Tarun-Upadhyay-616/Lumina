import React from 'react';
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom"
import SignUpPage from "./Pages/SignUpPage"
import SignInPage from './Pages/SignInPage';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/signin" element={<SignInPage/>} />
          <Route path="*" element={<Navigate to="/auth/signup" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
