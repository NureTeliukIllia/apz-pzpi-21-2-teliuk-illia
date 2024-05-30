import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

interface UpdateIngredientModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: { name: string; price: number }) => void;
    initialData: {
        name: string;
        price: number;
    } | null;
}

const UpdateIngredientModal: React.FC<UpdateIngredientModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialData,
}) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleUpdate = () => {
        onUpdate({ name, price });
    };

    return (
        <Modal open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2 }}>
                <h2>Update Ingredient</h2>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                >
                    Update
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateIngredientModal;
