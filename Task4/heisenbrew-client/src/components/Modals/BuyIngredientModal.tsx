// BuyIngredientModal.tsx
import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

interface BuyIngredientModalProps {
    open: boolean;
    onClose: () => void;
    onBuy: (data: { ingredientId: string; weight: number }) => void;
    ingredientId: string;
}

const BuyIngredientModal: React.FC<BuyIngredientModalProps> = ({
    open,
    onClose,
    onBuy,
    ingredientId,
}) => {
    const [weight, setWeight] = useState(0);

    const handleBuy = () => {
        onBuy({ ingredientId, weight });
    };

    return (
        <Modal open={open} onClose={onClose} style={{ marginTop: "10rem" }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <h2>Buy Ingredient</h2>
                <TextField
                    label="Weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button onClick={handleBuy} variant="contained" color="primary">
                    Buy
                </Button>
            </Box>
        </Modal>
    );
};

export default BuyIngredientModal;
