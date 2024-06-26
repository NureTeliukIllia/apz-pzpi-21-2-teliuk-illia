import styles from "./Auth.module.scss";
import {
    Avatar,
    Box,
    Container,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/authApi";
import { toast } from "react-toastify";
import { IAuthProps } from "../../types/interfaces";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "react-i18next";

const Register: FC<IAuthProps> = (props: IAuthProps) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (password === confirmPassword) {
            const response = signUp({ email: email, password: password });
            response
                .then((data) => {
                    localStorage.setItem("userId", data.userId);
                    localStorage.setItem("userRole", data.userRole);
                    localStorage.setItem("bearer", data.bearer);
                    props.setIsLogged(true);
                    navigate("/me");
                })
                .catch((error: any) => {
                    if (error.response) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error(t("registerError"));
                    }
                });
        } else {
            toast.error(t("passwordMismatch"));
        }
    };

    return (
        <>
            <Container style={{ marginTop: "1rem" }} maxWidth="lg">
                <Box
                    className={styles["Auth-box"]}
                    sx={{
                        mt: 5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "rgb(56, 55, 54)",
                            height: "10rem",
                            width: "10rem",
                        }}
                        className={styles["Avatar"]}
                    >
                        <LockOutlined sx={{ fontSize: "5rem" }} />
                    </Avatar>
                    <Typography variant="h2">{t("signUp")}</Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{
                                        className: styles["Text-field"],
                                    }}
                                    InputLabelProps={{
                                        className: styles["Text-field--label"],
                                    }}
                                    required
                                    fullWidth
                                    id="email"
                                    label={t("emailAddress")}
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{
                                        className: styles["Text-field"],
                                    }}
                                    InputLabelProps={{
                                        className: styles["Text-field--label"],
                                    }}
                                    required
                                    fullWidth
                                    name="password"
                                    label={t("password")}
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{
                                        className: styles["Text-field"],
                                    }}
                                    InputLabelProps={{
                                        className: styles["Text-field--label"],
                                    }}
                                    name="confirmPassword"
                                    required
                                    fullWidth
                                    type="password"
                                    id="confirmPassword"
                                    label={t("confirmPassword")}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Button
                            customStyles={styles["Button"]}
                            handleClick={handleSignUp}
                            title={t("signUp")}
                        >
                            {t("signUp")}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login" className={styles["Link"]}>
                                    {t("alreadyHaveAccount")}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Register;
