import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (firstName: string, lastName: string) => void;
    initialFirstName: string;
    initialLastName: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    open,
    onClose,
    onSave,
    initialFirstName,
    initialLastName,
}) => {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    const handleSave = () => {
        onSave(firstName, lastName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle style={{ fontSize: "3rem" }}>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    autoFocus
                    margin="normal"
                    inputProps={{ style: { fontSize: 40 } }}
                    InputLabelProps={{ style: { fontSize: 40 } }}
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ style: { fontSize: 40 } }}
                    InputLabelProps={{ style: { fontSize: 40 } }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    style={{ fontSize: "3rem" }}
                    onClick={onClose}
                    color="secondary"
                >
                    Cancel
                </Button>
                <Button
                    style={{ fontSize: "3rem" }}
                    onClick={handleSave}
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;
