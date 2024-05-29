// DataSwitcher.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Container } from "@mui/material";
import HomeRecipes from "../MainTables/HomeRecipes";
import HomeBrewingEquipment from "../MainTables/HomeBrewingEquipment";
import HomeIngredients from "../MainTables/HomeIngredients";
import { getItemsList } from "../../services/api";

const DataSwitcher: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [dataType, setDataType] = useState<string>("Ingredient");

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

    return (
        <Container>
            <ButtonGroup
                variant="contained"
                color="primary"
                style={{ marginBottom: "20px" }}
                size="large"
            >
                <Button
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Recipe")}
                >
                    Recipes
                </Button>
                <Button
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Equipment")}
                >
                    Equipment
                </Button>
                <Button
                    style={{ fontSize: "2rem" }}
                    onClick={() => setDataType("Ingredient")}
                >
                    Ingredients
                </Button>
            </ButtonGroup>
            {dataType === "Recipe" && <HomeRecipes data={data} />}
            {dataType === "Equipment" && <HomeBrewingEquipment data={data} onDataChange={handleDataChange} />}
            {dataType === "Ingredient" && <HomeIngredients data={data} />}
        </Container>
    );
};

export default DataSwitcher;
