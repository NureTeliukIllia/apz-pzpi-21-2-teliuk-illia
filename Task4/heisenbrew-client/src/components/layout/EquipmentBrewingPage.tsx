import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import axios from "axios";
import {
    getItemsList,
    getOwnEquipmentInfo,
    getCurrentBrewingStatus,
    getEquipmentStatus,
    getEquipmentAvailability,
    updateConnectionString,
    startNewBrewing,
} from "../../services/api";
import { RecipeDto } from "./RecipeDetails";
import { toast } from "react-toastify";

interface BrewerBrewingEquipmentFullInfoDto {
    id: string;
    name: string;
    imgUrl: string;
    connectionString: string;
    isBrewing: boolean;
}

interface EquipmentStatusDto {
    temperature: number;
    pressure: number;
    humidity: number;
    fullness: number;
    lastUpdate: string;
    isBrewing: boolean;
}

interface BrewingFullInfoDto {
    id: string;
    recipeId: string;
    equipmentTitle: string;
    recipeTitle: string;
    brewingStatus: string;
    lastUpdateDate: string;
    brewingLogs: BrewingLogDto[];
    createdAt: string;
}

interface BrewingLogDto {
    statusCode: string;
    message: string;
    logTime: string;
}

const MyEquipmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [equipment, setEquipment] =
        useState<BrewerBrewingEquipmentFullInfoDto | null>(null);
    const [connectionString, setConnectionString] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);
    const [logs, setLogs] = useState<string | JSX.Element>("");
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(
        null,
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const equipmentResponse = await getOwnEquipmentInfo(id!);
                setEquipment(equipmentResponse);
                setConnectionString(equipmentResponse.connectionString || "");

                const recipesResponse = await getItemsList("Recipe");
                setRecipes(recipesResponse.data);

                checkEquipmentStatus();
                const intervalId = setInterval(checkEquipmentStatus, 3000);

                return () => clearInterval(intervalId);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, [id]);

    const checkEquipmentStatus = async () => {
        try {
            const availabilityResponse = (await getEquipmentAvailability(
                id!,
            )) as unknown as boolean;
            setIsAvailable(availabilityResponse);

            if (!availabilityResponse) {
                setLogs(
                    "The device is not available, check your connection string!",
                );
            } else {
                const equipmentStatusResponse = (await getEquipmentStatus(
                    id!,
                )) as unknown as EquipmentStatusDto;
                if (equipmentStatusResponse.isBrewing) {
                    const brewingStatusResponse =
                        (await getCurrentBrewingStatus(
                            id!,
                        )) as unknown as BrewingFullInfoDto;
                    setLogs(
                        <Box>
                            {brewingStatusResponse.brewingLogs.map(
                                (log, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{ fontSize: "1.5rem" }}
                                    >
                                        [{log.logTime}] {log.statusCode}:{" "}
                                        {log.message}
                                    </Typography>
                                ),
                            )}
                        </Box>,
                    );
                } else {
                    setLogs(
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                Temperature:{" "}
                                {equipmentStatusResponse.temperature}°C
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                Pressure: {equipmentStatusResponse.pressure} Pa
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                Humidity: {equipmentStatusResponse.humidity} %
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                Fullness: {equipmentStatusResponse.fullness} %
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                Last Update:{" "}
                                {equipmentStatusResponse.lastUpdate}
                            </Typography>
                        </Box>,
                    );
                }
            }
        } catch (error) {
            console.error("Error checking equipment status:", error);
        }
    };

    const handleConnectionStringChange = async () => {
        const response = updateConnectionString(id!, connectionString);
        response.catch((error: any) => {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        });
    };

    const handleRecipeSelect = (recipe: RecipeDto) => {
        if (selectedRecipe?.id === recipe.id) {
            setSelectedRecipe(null);
        } else {
            setSelectedRecipe(recipe);
        }
    };

    const handleStartBrewing = async () => {
        if (!selectedRecipe) return;
        const response = startNewBrewing(selectedRecipe.id, id!);
        response.catch((error: any) => {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        });
    };

    if (!equipment) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    return (
        <Container>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    {equipment.name}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginTop: 4,
                    }}
                >
                    <Box sx={{ flex: 1, marginRight: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Connection String
                        </Typography>
                        <TextField
                            value={connectionString}
                            onChange={(e) =>
                                setConnectionString(e.target.value)
                            }
                            fullWidth
                            margin="normal"
                            InputProps={{ style: { fontSize: "1.5rem" } }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConnectionStringChange}
                            sx={{ fontSize: "1.5rem" }}
                        >
                            Update Connection String
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: "#000",
                            color: "#fff",
                            padding: 2,
                            height: "300px",
                            overflowY: "scroll",
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Brewing Logs
                        </Typography>
                        <Box sx={{ fontSize: "1.5rem" }}>{logs}</Box>
                    </Box>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Brewing Status
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.5rem" }}>
                        {equipment.isBrewing
                            ? "Brewing in progress"
                            : "Not brewing"}
                    </Typography>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Start Brewing
                    </Typography>
                    <List subheader={<ListSubheader>Recipes</ListSubheader>}>
                        {recipes.map((recipe) => (
                            <ListItem
                                button
                                key={recipe.id}
                                onClick={() => handleRecipeSelect(recipe)}
                                selected={selectedRecipe?.id === recipe.id}
                            >
                                <ListItemText
                                    primary={recipe.title}
                                    primaryTypographyProps={{
                                        style: { fontSize: "1.5rem" },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    {selectedRecipe && (
                        <Box sx={{ textAlign: "center", marginTop: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                {selectedRecipe.title}
                            </Typography>
                            <Box>
                                {selectedRecipe.ingredients.map(
                                    (ingredient) => (
                                        <Typography
                                            key={ingredient.id}
                                            variant="body1"
                                            sx={{ fontSize: "1.2rem" }}
                                        >
                                            {ingredient.name} -{" "}
                                            {ingredient.weight}g
                                        </Typography>
                                    ),
                                )}
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleStartBrewing}
                                disabled={equipment.isBrewing}
                                sx={{ marginTop: 2, fontSize: "1.5rem" }}
                            >
                                Start Brewing
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default MyEquipmentPage;
