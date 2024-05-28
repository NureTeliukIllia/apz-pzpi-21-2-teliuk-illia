import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { getEquipmentDetails } from "../../services/api";

interface HomeBrewingEquipmentFullInfoDto {
    id: string;
    name: string;
    description: string;
    price: number;
}

const EquipmentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [equipment, setEquipment] =
        useState<HomeBrewingEquipmentFullInfoDto | null>(null);
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await getEquipmentDetails(id!);
                setEquipment(response.data);
            } catch (error) {
                console.error("Error fetching equipment details:", error);
            }
        };

        fetchEquipment();
    }, [id]);

    if (!equipment) {
        return <Typography>Loading...</Typography>;
    }

    const handleBuy = () => {
        console.log(`Buy Equipment with id: ${equipment.id}`);
    };

    const handleUpdate = () => {
        console.log(`Update Equipment with id: ${equipment.id}`);
    };

    const handleDelete = () => {
        console.log(`Delete Equipment with id: ${equipment.id}`);
    };

    return (
        <Container>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    {equipment.name}
                </Typography>
                <Typography
                    variant="body1"
                    style={{ fontSize: "2rem" }}
                    gutterBottom
                >
                    {equipment.description}
                </Typography>
                <Typography
                    variant="h5"
                    style={{
                        fontSize: "3rem",
                        padding: "1rem",
                        border: "0.01rem solid black",
                    }}
                    gutterBottom
                >
                    {equipment.price} $
                </Typography>
                {isLogged ? (
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ fontSize: "1.5rem", marginRight: 2 }}
                            onClick={handleBuy}
                        >
                            Buy
                        </Button>
                        {userRole === "Administrator" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ fontSize: "1.5rem", marginRight: 2 }}
                                    onClick={handleUpdate}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ fontSize: "1.5rem" }}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography variant="h5">
                        <Button
                            component={RouterLink}
                            to="/login"
                            color="primary"
                            sx={{ fontSize: "1.5rem" }}
                        >
                            Login first!
                        </Button>
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default EquipmentDetails;
