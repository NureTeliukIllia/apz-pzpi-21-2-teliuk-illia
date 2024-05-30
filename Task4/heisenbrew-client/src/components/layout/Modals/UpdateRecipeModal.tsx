import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { getItemsList } from "../../../services/api";
import { RecipeIngredientDto } from "../MainTables/HomeRecipes";

interface UpdateRecipeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        ingredients: RecipeIngredientDto[];
    }) => void;
    initialData: {
        title: string;
        description: string;
        ingredients: RecipeIngredientDto[];
    };
}

interface Ingredient {
    id: string;
    name: string;
}

const UpdateRecipeModal: React.FC<UpdateRecipeModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [ingredients, setIngredients] = useState<RecipeIngredientDto[]>(
        initialData.ingredients,
    );
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [newIngredientId, setNewIngredientId] = useState<string>("");
    const [newIngredientWeight, setNewIngredientWeight] = useState<number>(0);

    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await getItemsList("Ingredient");
            setAllIngredients(response.data);
        };

        fetchIngredients();
    }, []);

    useEffect(() => {
        if (open) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setIngredients(initialData.ingredients);
        } else {
            setNewIngredientId("");
            setNewIngredientWeight(0);
        }
    }, [open, initialData]);

    const handleAddIngredient = () => {
        if (newIngredientId && newIngredientWeight > 0) {
            setIngredients((prevIngredients) => {
                const existingIngredient = prevIngredients.find(
                    (ing) => ing.id === newIngredientId,
                );

                if (existingIngredient) {
                    return prevIngredients.map((ing) =>
                        ing.id === newIngredientId
                            ? { ...ing, weight: newIngredientWeight }
                            : ing,
                    );
                } else {
                    const newIngredient: RecipeIngredientDto = {
                        id: newIngredientId,
                        name:
                            allIngredients.find(
                                (ing) => ing.id === newIngredientId,
                            )?.name || "",
                        weight: newIngredientWeight,
                    };
                    return [...prevIngredients, newIngredient];
                }
            });
            setNewIngredientId("");
            setNewIngredientWeight(0);
        }
    };

    const handleSave = () => {
        onSubmit({ title, description, ingredients });
    };

    const adjustWeight = (id: string, adjustment: number) => {
        setIngredients((prevIngredients) =>
            prevIngredients.map((ing) =>
                ing.id === id
                    ? { ...ing, weight: ing.weight + adjustment }
                    : ing,
            ),
        );
    };

    return (
        <Modal open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <h2 style={{ fontSize: "2.5rem" }}>Update Recipe</h2>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    sx={{ mb: 2, fontSize: "2.5rem" }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    sx={{ mb: 2, fontSize: "2.5rem" }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <h3 style={{ color: "blue", fontSize: "2.5rem" }}>
                    Ingredients
                </h3>
                {ingredients.map((ingredient, index) => (
                    <div
                        key={index}
                        style={{
                            color: "green",
                            fontSize: "2rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <span>{ingredient.name}: </span>
                        <TextField
                            type="number"
                            value={ingredient.weight}
                            onChange={(e) => {
                                const newWeight = parseInt(e.target.value);
                                setIngredients((prevIngredients) =>
                                    prevIngredients.map((ing) =>
                                        ing.id === ingredient.id
                                            ? { ...ing, weight: newWeight }
                                            : ing,
                                    ),
                                );
                            }}
                            sx={{
                                width: "80px",
                                marginRight: "10px",
                                fontSize: "2.5rem",
                            }}
                            inputProps={{ style: { fontSize: 20 } }}
                            InputLabelProps={{ style: { fontSize: 20 } }}
                        />
                        <Button
                            onClick={() => adjustWeight(ingredient.id, 1)}
                            sx={{ fontSize: "2rem" }}
                        >
                            +
                        </Button>
                        <Button
                            onClick={() => adjustWeight(ingredient.id, -1)}
                            sx={{ fontSize: "2rem", marginLeft: "5px" }}
                        >
                            -
                        </Button>
                        <span>g</span>
                    </div>
                ))}

                <FormControl fullWidth sx={{ mb: 2, fontSize: "2rem" }}>
                    <InputLabel id="ingredient-label" sx={{ fontSize: 20 }}>
                        Ingredient
                    </InputLabel>
                    <Select
                        labelId="ingredient-label"
                        value={newIngredientId}
                        onChange={(e) => setNewIngredientId(e.target.value)}
                        sx={{ fontSize: "2.5rem" }}
                    >
                        {allIngredients.map((ingredient) => (
                            <MenuItem
                                key={ingredient.id}
                                value={ingredient.id}
                                sx={{ fontSize: "2.5rem" }}
                            >
                                {ingredient.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Weight (g)"
                    type="number"
                    value={newIngredientWeight}
                    onChange={(e) =>
                        setNewIngredientWeight(parseInt(e.target.value))
                    }
                    fullWidth
                    sx={{ mb: 2, fontSize: "2.5rem" }}
                    inputProps={{ style: { fontSize: 20 } }}
                    InputLabelProps={{ style: { fontSize: 20 } }}
                />
                <Button
                    onClick={handleAddIngredient}
                    variant="contained"
                    sx={{ mb: 2, fontSize: "2rem" }}
                >
                    Add Ingredient
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2, mb: 2, fontSize: "2rem" }}
                >
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateRecipeModal;