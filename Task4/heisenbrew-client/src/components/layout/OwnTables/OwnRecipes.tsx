import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Link,
    Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CreateRecipeModal from "../Modals/CreateRecipeModal";
import {
    deleteRecipe,
    updateRecipe,
    createRecipe,
} from "../../../services/api";
import { RecipeDto } from "../../../pages/RecipeDetails";
import { RecipeIngredientDto } from "../MainTables/HomeRecipes";
import UpdateRecipeModal from "../Modals/UpdateRecipeModal";
import { ConfirmationModal } from "../Modals/Modals";

export interface OwnRecipeDto {
    id: string;
    title: string;
    description: string;
    brewerName: string;
    cookingPrice: number;
}

interface OwnRecipesProps {
    data: RecipeDto[];
    onRecipesChange: () => void;
}

const OwnRecipes: React.FC<OwnRecipesProps> = ({ data, onRecipesChange }) => {
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
        null,
    );
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDto | null>(
        null,
    );
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isCreateRecipeModalOpen, setIsCreateRecipeModalOpen] =
        useState(false);

    const handleUpdate = (recipe: RecipeDto) => {
        setSelectedRecipe(recipe);
        setUpdateModalOpen(true);
    };

    const handleConfirmUpdate = async (updatedData: {
        title: string;
        description: string;
        ingredients: RecipeIngredientDto[];
    }) => {
        if (selectedRecipe) {
            const updatedRecipe = {
                ...updatedData,
                ingredients: updatedData.ingredients.map((item) => ({
                    id: item.id,
                    weight: item.weight,
                })),
            };
            await updateRecipe({ ...updatedRecipe, id: selectedRecipe.id });
            setUpdateModalOpen(false);
            onRecipesChange();
        }
    };

    const handleDelete = (id: string) => {
        setSelectedRecipeId(id);
        setDeleteModalOpen(true);
    };

    const handleCreateRecipe = async (newRecipe: any) => {
        try {
            console.log(newRecipe);
            await createRecipe(newRecipe);
            setIsCreateRecipeModalOpen(false);
            onRecipesChange();
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedRecipeId) {
            await deleteRecipe(selectedRecipeId);
            setDeleteModalOpen(false);
            onRecipesChange();
        }
    };

    return (
        <Box sx={{ marginTop: 2 }}>
            {userRole === "Administrator" && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2, fontSize: "1.2rem" }}
                    onClick={() => setIsCreateRecipeModalOpen(true)}
                >
                    Create Recipe
                </Button>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Title
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Description
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Cooking Price
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    <Link
                                        component={RouterLink}
                                        to={`/recipe/${item.id}`}
                                        sx={{ fontSize: "1.5rem" }}
                                    >
                                        {item.title}
                                    </Link>
                                </TableCell>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    {item.description}
                                </TableCell>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    ${item.cookingPrice}
                                </TableCell>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            fontSize: "1.2rem",
                                            marginLeft: 1,
                                        }}
                                        onClick={() => handleUpdate(item)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            fontSize: "1.2rem",
                                            marginLeft: 1,
                                        }}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateRecipeModal
                open={isCreateRecipeModalOpen}
                onClose={() => setIsCreateRecipeModalOpen(false)}
                onSubmit={handleCreateRecipe}
            />

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Recipe"
                description="Do you really want to delete this recipe?"
            />

            {selectedRecipe && (
                <UpdateRecipeModal
                    open={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onSubmit={handleConfirmUpdate}
                    initialData={selectedRecipe}
                />
            )}
        </Box>
    );
};

export default OwnRecipes;
