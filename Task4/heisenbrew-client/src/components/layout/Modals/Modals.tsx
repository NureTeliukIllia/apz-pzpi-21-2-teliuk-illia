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
    <Dialog open={open} onClose={onClose} style={{ marginTop: "5rem" }}>
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
