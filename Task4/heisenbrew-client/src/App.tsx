import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/Header/Header";
import Login from "./components/layout/Auth/Login";
import Register from "./components/layout/Auth/Register";
import NotFound from "./components/layout/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import Home from "./components/layout/Home/Home";


function App() {
    const user = localStorage.getItem("userId");
    const [isLogged, setIsLogged] = useState<boolean>(user?.length! > 0);
    const [currentPage, setCurrentPage] = useState<string>("Home");
    const [selectedHowl, setSelectedHowl] = useState(null);
    const [playing, setPlaying] = useState(false);

    return (
        <>
            <Header
                isLogged={isLogged}
                setIsLogged={setIsLogged}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <ToastContainer className="toast" />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home

                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                            <Login
                                setIsLogged={setIsLogged}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                    }
                />
                <Route
                    path="/register"
                    element={
                            <Register
                                setIsLogged={setIsLogged}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
