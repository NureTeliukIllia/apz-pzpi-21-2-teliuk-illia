import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Container } from "@mui/material";
import Recipe from "./Recipe";
import BrewingEquipment from "./BrewingEquipment";
import Ingredient from "./Ingredient";

const DataSwitcher: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [dataType, setDataType] = useState<string>("Ingredient");

    const fetchData = async (type: string) => {
        try {
            const response = await axios.get(
                `https://localhost:7084/api/${type}`,
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(dataType);
    }, [dataType]);

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
            {dataType === "Recipe" && <Recipe data={data} />}
            {dataType === "Equipment" && <BrewingEquipment data={data} />}
            {dataType === "Ingredient" && <Ingredient data={data} />}
        </Container>
    );
};

export default DataSwitcher;
