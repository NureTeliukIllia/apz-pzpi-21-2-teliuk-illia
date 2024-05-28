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
    const [isBrewing, setIsBrewing] = useState(false);
    const [brewingLogs, setBrewingLogs] = useState<string | JSX.Element>("");
    const [equipmentLogs, setEquipmentLogs] = useState<string | JSX.Element>(
        "",
    );
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
            const availabilityResponse = await getEquipmentAvailability(id!);
            setIsAvailable(availabilityResponse);

            if (!availabilityResponse) {
                setBrewingLogs(
                    "The device is not available, check your connection string!",
                );
                setEquipmentLogs(
                    "The device is not available, check your connection string!",
                );
            } else {
                const equipmentStatusResponse = await getEquipmentStatus(id!);

                if (equipmentStatusResponse.isBrewing) {
                    setIsBrewing(true);
                    const brewingStatusResponse = await getCurrentBrewingStatus(
                        id!,
                    );
                    setBrewingLogs(
                        <Box>
                            {brewingStatusResponse.brewingLogs.map(
                                (log: any, index: number) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            fontSize: "1.5rem",
                                            textAlign: "left",
                                        }}
                                    >
                                        [{log.logTime}] {log.statusCode}:{" "}
                                        {log.message}
                                    </Typography>
                                ),
                            )}
                        </Box>,
                    );
                } else {
                    setIsBrewing(false);
                    setBrewingLogs("No brewings yet.");
                }

                setEquipmentLogs(
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Temperature: {equipmentStatusResponse.temperature}°C
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Pressure: {equipmentStatusResponse.pressure} Pa
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Humidity: {equipmentStatusResponse.humidity} %
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Fullness: {equipmentStatusResponse.fullness} %
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "1.5rem", textAlign: "left" }}
                        >
                            Last Update: {equipmentStatusResponse.lastUpdate}
                        </Typography>
                    </Box>,
                );
            }
        } catch (error) {
            console.error("Error checking equipment status:", error);
        }
    };

    const handleConnectionStringChange = async () => {
        try {
            await updateConnectionString(id!, connectionString);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
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
        try {
            await startNewBrewing(selectedRecipe.id, id!);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    };

    if (!equipment) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    return (
        <Container>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                   ( {equipment.id.split("-")[0]}) {equipment.name} {isBrewing ? "🟢" : "🔴"}
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
                        <Typography variant="h3" gutterBottom>
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
                    <Box sx={{ flex: 1 }}>
                        <Box
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                padding: 2,
                                height: "150px",
                                overflowY: "scroll",
                                marginBottom: 2,
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Current Brewing Status
                            </Typography>
                            <Box sx={{ fontSize: "1.5rem", textAlign: "left" }}>
                                {brewingLogs}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff",
                                padding: 2,
                                height: "150px",
                                overflowY: "scroll",
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Equipment Status
                            </Typography>
                            <Box sx={{ fontSize: "1.5rem", textAlign: "left" }}>
                                {equipmentLogs}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h3" gutterBottom>
                        Choose a recipe to brew
                    </Typography>
                    <List>
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
                                        style: { fontSize: "2.5rem" },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    {selectedRecipe && (
                        <Box sx={{ textAlign: "center", marginTop: 2 }}>
                            <Typography
                                variant="h4"
                                sx={{ fontSize: "2.5rem" }}
                            >
                                {selectedRecipe.title}
                            </Typography>
                            <Box>
                                {selectedRecipe.ingredients.map(
                                    (ingredient) => (
                                        <Typography
                                            key={ingredient.id}
                                            variant="body1"
                                            sx={{ fontSize: "2rem" }}
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
