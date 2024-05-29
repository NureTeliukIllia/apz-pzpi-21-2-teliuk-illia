// Modals.tsx
import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ fontSize: "2rem" }}>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontSize: "1.5rem" }}>
                {description}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}
                color="primary"
                sx={{ fontSize: "1.2rem" }}
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                color="primary"
                sx={{ fontSize: "1.2rem" }}
            >
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
);

interface UpdateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedData: { name: string; price: number }) => void;
    initialData: { name: string; price: number };
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [name, setName] = React.useState(initialData.name);
    const [price, setPrice] = React.useState(initialData.price);

    const handleSubmit = () => {
        onSubmit({ name, price });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: "2rem" }}>
                Update Equipment
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{ style: { fontSize: "1.5rem" } }}
                />
                <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{ style: { fontSize: "1.5rem" } }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    sx={{ fontSize: "1.2rem" }}
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};
