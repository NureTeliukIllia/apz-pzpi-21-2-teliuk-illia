import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import axios from "axios";
import { getItemsList, getOwnEquipmentInfo } from "../../services/api";
import { RecipeDto } from "./RecipeDetails";

interface BrewerBrewingEquipmentFullInfoDto {
    id: string;
    name: string;
    imgUrl: string;
    connectionString: string;
    isBrewing: boolean;
}


const MyEquipmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [equipment, setEquipment] =
        useState<BrewerBrewingEquipmentFullInfoDto | null>(null);
    const [connectionString, setConnectionString] = useState(
        "",
    );
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(
        null,
    );

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await getOwnEquipmentInfo(id!);
                console.log("Response: ", response);
                setEquipment(response);
                setConnectionString(
                    response.connectionString
                        ? response.connectionString
                        : "",
                );
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };

        const fetchRecipes = async () => {
            try {
                const response = await getItemsList("Recipe");
                setRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchEquipment();
        fetchRecipes();
    }, [id]);

    const handleConnectionStringChange = async () => {
        try {
            await axios.put(`/api/equipment/${id}/connection-string`, {
                connectionString,
            });
            // Optionally, update the equipment data if needed
        } catch (error) {
            console.error("Error updating connection string:", error);
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
            await axios.post(`/api/equipment/${id}/start-brewing`, {
                recipeId: selectedRecipe.id,
            });
            // Optionally, update the equipment data if needed
        } catch (error) {
            console.error("Error starting brewing:", error);
        }
    };

    if (!equipment) {
        return <Typography>Loading...</Typography>;
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
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Brewing Logs
                        </Typography>
                        {/* Replace with actual logs */}
                        <pre style={{ fontSize: "1.5rem" }}>
                            Log data here...
                        </pre>
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
