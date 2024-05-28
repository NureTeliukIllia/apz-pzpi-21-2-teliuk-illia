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

interface StartBrewingDto {
    recipeId: string;
    equipmentId: string;
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
