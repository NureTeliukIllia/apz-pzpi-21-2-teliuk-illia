import axios from "axios";
// import {
//     AlbumsList,
//     CreateAlbumDto,
//     CreatePictureDto,
//     Pictures,
//     UpdateAlbumDto,
// } from "../types/types";

const url = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "https://localhost:7084/api/";

interface UpdateBrewerProfileDto {
    firstName: string;
    lastName: string;
}

interface UpdateConnectionStringDto {
    equipmentId: string;
    connectionString: string;
}

interface UpdateEquipmentDto {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface CreateEquipmentDto {
    name: string;
    description: string;
    price: number;
}

interface UpdateRecipeDto {
    id: string;
    title: string;
    description: string;
    ingredients: RecipeIngredientDto[];
}

interface CreateRecipeDto {
    title: string;
    description: string;
    ingredients: RecipeIngredientDto[];
}

interface RecipeIngredientDto {
    ingredientId: string;
    weight: number;
}

export const getItemsList = async (type: string) =>
    await axios.get(`https://localhost:7084/api/${type}`);

export const getEquipmentDetails = async (equipmentId: string) =>
    await axios.get(`${url}Equipment/${equipmentId}`);

export const getRecipeDetails = async (recipeId: string) =>
    await axios.get(`${url}Recipe/${recipeId}`);

export const getOwnProfile = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Profile/me`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getOwnEquipment = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Equipment/my-equipment`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getOwnEquipmentInfo = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Equipment/my-equipment/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getOwnIngredients = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(
        `${url}Ingredient/my-ingredients`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getOwnRecipes = async () => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get<string>(`${url}Recipe/my-recipes`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const updateProfile = async (
    newFirstName: string,
    newLastName: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const request: UpdateBrewerProfileDto = {
        firstName: newFirstName,
        lastName: newLastName,
    };
    const { data } = await axios.put<UpdateBrewerProfileDto>(
        `${url}Profile/edit`,
        request,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const updateConnectionString = async (
    equipmentId: string,
    newConnectionString: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const request: UpdateConnectionStringDto = {
        equipmentId: equipmentId,
        connectionString: newConnectionString,
    };
    const { data } = await axios.put(
        `${url}Brewing/my-equipment/update-string`,
        request,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getCurrentBrewingStatus = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/brewing-status/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getEquipmentStatus = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/equipment-status/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const getEquipmentAvailability = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");

    const { data } = await axios.get(
        `${url}Brewing/equipment-availability/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const startNewBrewing = async (
    recipeId: string,
    equipmentId: string,
) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Brewing/start?recipeId=${recipeId}&equipmentId=${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const abortBrewing = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(`${url}Brewing/abort/${equipmentId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const getBrewingHistory = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Brewing/equipment-brewings/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const buyEquipment = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.get(
        `${url}Equipment/my-equipment/buy/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const deleteEquipment = async (equipmentId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.delete(
        `${url}Equipment/delete/${equipmentId}`,
        {
            headers: { Authorization: `Bearer ${bearer}` },
        },
    );

    return data;
};

export const updateEquipment = async (newEquipment: UpdateEquipmentDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.put(`${url}Equipment/update`, newEquipment, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const createEquipment = async (newEquipment: CreateEquipmentDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(`${url}Equipment/create`, newEquipment, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const deleteRecipe = async (recipeId: string) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.delete(`${url}Recipe/delete/${recipeId}`, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const updateRecipe = async (newRecipe: UpdateRecipeDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.put(`${url}Recipe/update`, newRecipe, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};

export const createRecipe = async (newRecipe: CreateRecipeDto) => {
    const bearer = localStorage.getItem("bearer");
    const { data } = await axios.post(`${url}Recipe/create`, newRecipe, {
        headers: { Authorization: `Bearer ${bearer}` },
    });

    return data;
};
