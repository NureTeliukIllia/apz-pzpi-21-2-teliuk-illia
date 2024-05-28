import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { getRecipeDetails } from "../../services/api";

interface RecipeHomeIngredientsDto {
    id: string;
    name: string;
    weight: number;
}

export interface RecipeDto {
    id: string;
    title: string;
    description: string;
    ingredients: RecipeHomeIngredientsDto[];
    brewerName: string;
    cookingPrice: number;
}

const RecipeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeDto | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await getRecipeDetails(id!);
                setRecipe(response.data);
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const handleBuy = () => {
        console.log(`Buy Recipe with id: ${recipe.id}`);
    };

    const handleUpdate = () => {
        console.log(`Update Recipe with id: ${recipe.id}`);
    };

    const handleDelete = () => {
        console.log(`Delete Recipe with id: ${recipe.id}`);
    };

    return (
        <Container>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h1" gutterBottom>
                    {recipe.title}
                </Typography>
                <Typography variant="h3" gutterBottom>
                    Created by: {recipe.brewerName}
                </Typography>
                <Typography variant="h4" gutterBottom>
                    {recipe.description}
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Ingredientss
                </Typography>
                <Box display="flex" justifyContent="center">
                    <List
                        sx={{ border: "1px solid grey", marginBottom: "1rem" }}
                    >
                        {recipe.ingredients.map((ingredient) => (
                            <ListItem key={ingredient.id}>
                                <ListItemText
                                    primary={`${ingredient.name} - ${ingredient.weight}g`}
                                    primaryTypographyProps={{
                                        fontSize: "1.8rem",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Typography
                    style={{
                        fontSize: "3rem",
                        padding: "1rem",
                        border: "0.01rem solid black",
                    }}
                    gutterBottom
                >
                    Cooking Price: ${recipe.cookingPrice}
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

export default RecipeDetails;
