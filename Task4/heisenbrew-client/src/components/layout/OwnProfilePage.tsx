import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";

import EditProfileModal from "../Modals/EditProfileModal";
import {
    getOwnEquipment,
    getOwnIngredients,
    getOwnProfile,
    getOwnRecipes,
    updateProfile,
} from "../../services/api";
import OwnBrewingEquipment, {
    OwnBrewingEquipmentDto,
} from "../OwnTables/OwnBrewingEquipment";

import OwnIngredients, { OwnIngredientsDto } from "../OwnTables/OwnIngredients";
import OwnRecipes, { OwnRecipeDto } from "../OwnTables/OwnRecipes";
import { RecipeDto } from "./RecipeDetails";

interface BrewerProfileDto {
    id: string;
    fullName: string;
    profileColor: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<BrewerProfileDto | null>(null);
    const [equipment, setEquipment] = useState<OwnBrewingEquipmentDto[] | null>(
        null,
    );
    const [ingredients, setIngredientss] = useState<OwnIngredientsDto[] | null>(
        null,
    );
    const [recipes, setRecipes] = useState<RecipeDto[] | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;
    const userId = localStorage.getItem("userId");

    const fetchProfileData = async () => {
        try {
            const profileData =
                (await getOwnProfile()) as unknown as BrewerProfileDto;
            setProfile(profileData);

            const equipmentData =
                (await getOwnEquipment()) as unknown as OwnBrewingEquipmentDto[];
            setEquipment(equipmentData);

            const ingredientsData =
                (await getOwnIngredients()) as unknown as OwnIngredientsDto[];
            setIngredientss(ingredientsData);

            const recipesData =
                (await getOwnRecipes()) as unknown as RecipeDto[];
            setRecipes(recipesData);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const handleDataChange = () => {
        fetchProfileData();
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (!profile || !equipment || !ingredients || !recipes) {
        return <Typography>Loading...</Typography>;
    }

    const handleEditProfile = () => {
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleSaveProfile = async (firstName: string, lastName: string) => {
        try {
            await updateProfile(firstName, lastName);
            const profileData =
                (await getOwnProfile()) as unknown as BrewerProfileDto;
            setProfile(profileData);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <Container style={{ marginTop: "5rem" }}>
            <Paper sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h2" gutterBottom>
                    Profile:{" "}
                    {profile.fullName !== " "
                        ? profile.fullName
                        : "Set your name!"}
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "3rem" }}
                    onClick={handleEditProfile}
                >
                    Edit Profile
                </Button>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Equipment
                    </Typography>
                    <OwnBrewingEquipment data={equipment} />
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Ingredients
                    </Typography>
                    <OwnIngredients data={ingredients} />
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Recipes
                    </Typography>
                    <OwnRecipes
                        data={recipes}
                        onRecipesChange={handleDataChange}
                    />
                </Box>
            </Paper>
            <EditProfileModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveProfile}
                initialFirstName={profile.fullName.split(" ")[0]}
                initialLastName={profile.fullName.split(" ")[1]}
            />
        </Container>
    );
};

export default ProfilePage;
