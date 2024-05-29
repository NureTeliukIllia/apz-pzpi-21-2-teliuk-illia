import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React, { useEffect } from "react";

interface UpdateEquipmentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (updatedData: { name: string; price: number }) => void;
    initialData: { name: string; price: number };
}

const UpdateEquipmentModal: React.FC<UpdateEquipmentModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [name, setName] = React.useState(initialData.name);
    const [price, setPrice] = React.useState(initialData.price);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleSubmit = () => {
        onSubmit({ name, price });
        setName("");
        setPrice(0);
    };

    const handleClose = () => {
        onClose();
        setName("");
        setPrice(0);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            style={{ marginTop: "10rem" }}
        >
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

export default UpdateEquipmentModal;
