import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
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
import {
    getRecipeDetails,
    deleteRecipe,
    updateRecipe,
} from "../../services/api";
import UpdateRecipeModal from "../Modals/UpdateRecipeModal";
import { ConfirmationModal } from "../Modals/Modals";

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
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleUpdate = () => {
        setUpdateModalOpen(true);
    };

    const handleConfirmUpdate = async (updatedData: {
        title: string;
        description: string;
        ingredients: RecipeHomeIngredientsDto[];
    }) => {
        if (recipe) {
            const updatedRecipe = {
                ...updatedData,
                ingredients: updatedData.ingredients.map((item) => ({
                    id: item.id,
                    weight: item.weight,
                })),
            };
            await updateRecipe({ ...updatedRecipe, id: recipe.id });
            setUpdateModalOpen(false);
            const response = await getRecipeDetails(recipe.id);
            setRecipe(response.data);
        }
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (recipe) {
            await deleteRecipe(recipe.id);
            setDeleteModalOpen(false);
            navigate("/");
        }
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
                    Ingredients
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
                {isLogged && userRole === "Administrator" && (
                    <Box>
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
                    </Box>
                )}
            </Paper>

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Recipe"
                description="Do you really want to delete this recipe?"
            />

            {recipe && (
                <UpdateRecipeModal
                    open={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onSubmit={handleConfirmUpdate}
                    initialData={recipe}
                />
            )}
        </Container>
    );
};

export default RecipeDetails;
