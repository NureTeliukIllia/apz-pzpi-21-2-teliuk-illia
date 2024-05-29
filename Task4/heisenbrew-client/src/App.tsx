import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header/Header";
import Login from "./components/layout/Auth/Login";
import Register from "./components/layout/Auth/Register";
import NotFound from "./components/layout/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import Home from "./components/layout/Home/Home";
import EquipmentDetails from "./components/layout/EquipmentDetails";
import RecipeDetails from "./components/layout/RecipeDetails";
import OwnProfilePage from "./components/layout/OwnProfilePage";
import MyEquipmentPage from "./components/layout/EquipmentBrewingPage";

function App() {
    const user = localStorage.getItem("userId");
    const [isLogged, setIsLogged] = useState<boolean>(user?.length! > 0);


    return (
        <>
            <Header
                isLogged={isLogged}
                setIsLogged={setIsLogged}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={
                        <Login
                            setIsLogged={setIsLogged}
                        />
                    }
                />
                <Route
                    path="/register"
                    element={
                        <Register
                            setIsLogged={setIsLogged}
                        />
                    }
                />
                <Route path="/equipment/:id" element={<EquipmentDetails />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/me" element={<OwnProfilePage />} />
                <Route path="/my-equipment/:id" element={<MyEquipmentPage />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="bottom-right" className="toast" />
        </>
    );
}

export default App;
