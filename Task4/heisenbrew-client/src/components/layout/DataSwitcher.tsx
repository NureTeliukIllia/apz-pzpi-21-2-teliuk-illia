import React, { useState, useEffect, useContext } from "react";
import { Button, ButtonGroup, Container } from "@mui/material";
import HomeRecipes from "../MainTables/HomeRecipes";
import HomeBrewingEquipment from "../MainTables/HomeBrewingEquipment";
import HomeIngredients from "../MainTables/HomeIngredients";
import { getItemsList } from "../../services/api";
import CreateRecipeModal from "../Modals/CreateRecipeModal";
import CreateEquipmentModal from "../Modals/CreateEquipmentModal";
import CreateIngredientModal from "../Modals/CreateIngredientModal";
import {
    createRecipe,
    createEquipment,
    createIngredient,
} from "../../services/api";

const DataSwitcher: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [dataType, setDataType] = useState<string>("Recipe");
    const [isCreateRecipeModalOpen, setIsCreateRecipeModalOpen] =
        useState(false);
    const [isCreateEquipmentModalOpen, setIsCreateEquipmentModalOpen] =
        useState(false);
    const [isCreateIngredientModalOpen, setIsCreateIngredientModalOpen] =
        useState(false);

    const userRole = localStorage.getItem("userRole");

    const fetchData = async (type: string) => {
        try {
            const response = await getItemsList(type);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(dataType);
    }, [dataType]);

    const handleDataChange = () => {
        fetchData(dataType);
    };

    const handleCreateRecipe = async (newRecipe: any) => {
        try {
            console.log(newRecipe);
            await createRecipe(newRecipe);
            setIsCreateRecipeModalOpen(false);
            fetchData("Recipe");
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    };

    const handleCreateEquipment = async (newEquipment: any) => {
        try {
            await createEquipment(newEquipment);
            setIsCreateEquipmentModalOpen(false);
            fetchData("Equipment");
        } catch (error) {
            console.error("Error creating equipment:", error);
        }
    };

    const handleCreateIngredient = async (newIngredient: any) => {
        try {
            await createIngredient(newIngredient);
            setIsCreateIngredientModalOpen(false);
            fetchData("Ingredient");
        } catch (error) {
            console.error("Error creating ingredient:", error);
        }
    };

    return (
        <Container>
            <ButtonGroup
                variant="contained"
                style={{ marginBottom: "2rem" }}
                size="large"
            >
                <Button
                    color={dataType === "Recipe" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Recipe")}
                >
                    Recipes
                </Button>
                <Button
                    color={dataType === "Equipment" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Equipment")}
                >
                    Equipment
                </Button>
                <Button
                    color={dataType === "Ingredient" ? "primary" : "secondary"}
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Ingredient")}
                >
                    Ingredients
                </Button>
            </ButtonGroup>

            {userRole === "Administrator" && (
                <ButtonGroup
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: "2rem", marginLeft: "2rem" }}
                    size="large"
                >
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateRecipeModalOpen(true)}
                        disabled={dataType !== "Recipe"}
                    >
                        Add Recipe
                    </Button>
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateEquipmentModalOpen(true)}
                        disabled={dataType !== "Equipment"}
                    >
                        Add Equipment
                    </Button>
                    <Button
                        style={{ fontSize: "2rem" }}
                        onClick={() => setIsCreateIngredientModalOpen(true)}
                        disabled={dataType !== "Ingredient"}
                    >
                        Add Ingredient
                    </Button>
                </ButtonGroup>
            )}

            {dataType === "Recipe" && (
                <HomeRecipes data={data} onDataChange={handleDataChange} />
            )}
            {dataType === "Equipment" && (
                <HomeBrewingEquipment
                    data={data}
                    onDataChange={handleDataChange}
                />
            )}
            {dataType === "Ingredient" && (
                <HomeIngredients data={data} onDataChange={handleDataChange} />
            )}

            <CreateRecipeModal
                open={isCreateRecipeModalOpen}
                onClose={() => setIsCreateRecipeModalOpen(false)}
                onSubmit={handleCreateRecipe}
            />
            <CreateEquipmentModal
                open={isCreateEquipmentModalOpen}
                onClose={() => setIsCreateEquipmentModalOpen(false)}
                onSubmit={handleCreateEquipment}
            />
            <CreateIngredientModal
                open={isCreateIngredientModalOpen}
                onClose={() => setIsCreateIngredientModalOpen(false)}
                onSubmit={handleCreateIngredient}
            />
        </Container>
    );
};

export default DataSwitcher;
