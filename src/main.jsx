import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // ✅ import router
import "./index.css";
import App from "./App.jsx";
import Signin from "../pages/signin.jsx";
import Reg from "../pages/registration.jsx"
import Details from "../pages/details.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/registration" element={<Reg/>}/>
         <Route path="/details" element={<Details/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
