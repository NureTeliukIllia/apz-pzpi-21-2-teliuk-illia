import { FC } from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IHeaderProps } from "../../../types/interfaces";
import { Button } from "../../Button/Button";
import logo from "../../../assets/logo-transparent-svg.svg";

export const Header: FC<IHeaderProps> = (props: IHeaderProps) => {
    const navigate = useNavigate();

    const LogOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("bearer");
        navigate("/");
        props.setIsLogged(false);
    };

    return (
        <div className={styles["header"]}>
            <div className={styles["container"]}>
                <div className={styles["logo__container"]}>
                    <img src={logo} alt="logo" />
                </div>
                <div className={styles["current-page"]}>
                    <h1>{props.currentPage}</h1>
                </div>
                <nav className={styles["nav"]}>
                    <Link
                        className={styles["nav-link"]}
                        to="/"
                        onClick={() => props.setCurrentPage("Home")}
                    >
                        Home
                    </Link>
                    <Link
                        className={styles["nav-link"]}
                        to={props.isLogged ? "/me" : "/login"}
                        onClick={() => {
                            if (props.isLogged) {
                                props.setCurrentPage("My Profile");
                            } else {
                                props.setCurrentPage("Login");
                                toast.warn("You need to login first.");
                            }
                        }}
                    >
                        My Profile
                    </Link>
                </nav>
                <div className={styles["auth"]}>
                    {props.isLogged ? (
                        <div>
                            <Button
                                title={"Log out"}
                                handleClick={() => LogOut()}
                            >
                                <h1>Log out</h1>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    title={"Login"}
                                    handleClick={() =>
                                        props.setCurrentPage("Login")
                                    }
                                >
                                    <h1>Login</h1>
                                </Button>
                            </Link>
                            <Link to="register">
                                <Button
                                    handleClick={() =>
                                        props.setCurrentPage("Sign Up")
                                    }
                                    customStyles={styles["sign-up"]}
                                    title={"Sign Up"}
                                >
                                    <h1>Sign Up</h1>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};