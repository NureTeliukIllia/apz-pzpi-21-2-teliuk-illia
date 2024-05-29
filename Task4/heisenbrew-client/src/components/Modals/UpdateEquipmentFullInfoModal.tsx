import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface UpdateEquipmentFullInfoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedData: {
        name: string;
        description: string;
        price: number;
    }) => void;
    initialData: { name: string; description: string; price: number };
}

const UpdateEquipmentFullInfoModal: React.FC<
    UpdateEquipmentFullInfoModalProps
> = ({ open, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState(initialData.name);
    const [description, setDescription] = useState(initialData.description);
    const [price, setPrice] = useState(initialData.price);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleSubmit = () => {
        onSubmit({ name, description, price });
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Equipment</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateEquipmentFullInfoModal;
