import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
    buyEquipment,
    deleteEquipment,
    updateEquipment,
} from "../../../services/api";
import UpdateEquipmentModal from "../Modals/UpdateEquipmentModal";
import { ConfirmationModal } from "../Modals/Modals";

interface HomeBrewingEquipmentShortInfoDto {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface HomeBrewingEquipmentProps {
    data: HomeBrewingEquipmentShortInfoDto[];
    onDataChange: () => void;
}

const HomeBrewingEquipment: React.FC<HomeBrewingEquipmentProps> = ({
    data,
    onDataChange,
}) => {
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const [selectedEquipmentId, setSelectedEquipmentId] = useState<
        string | null
    >(null);
    const [selectedEquipment, setSelectedEquipment] =
        useState<HomeBrewingEquipmentShortInfoDto | null>(null);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const handleBuy = async (id: string) => {
        setSelectedEquipmentId(id);
        setBuyModalOpen(true);
    };

    const handleConfirmBuy = async () => {
        if (selectedEquipmentId) {
            await buyEquipment(selectedEquipmentId);
            setBuyModalOpen(false);
            onDataChange();
        }
    };

    const handleUpdate = (equipment: HomeBrewingEquipmentShortInfoDto) => {
        console.log(equipment);
        setSelectedEquipment(equipment);
        setUpdateModalOpen(true);
    };

    const handleConfirmUpdate = async (updatedData: {
        name: string;
        price: number;
    }) => {
        if (selectedEquipment) {
            await updateEquipment({
                ...selectedEquipment,
                ...updatedData,
                description: selectedEquipment.description,
            });
            setUpdateModalOpen(false);
            onDataChange();
        }
    };

    const handleDelete = (id: string) => {
        setSelectedEquipmentId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedEquipmentId) {
            await deleteEquipment(selectedEquipmentId);
            setDeleteModalOpen(false);
            onDataChange();
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Name
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Price
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    <Link
                                        component={RouterLink}
                                        to={`/equipment/${item.id}`}
                                        sx={{ fontSize: "1.5rem" }}
                                    >
                                        {item.name}
                                    </Link>
                                </TableCell>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    {item.price}
                                </TableCell>
                                <TableCell sx={{ fontSize: "1.5rem" }}>
                                    {isLogged ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ fontSize: "1.2rem" }}
                                                onClick={() =>
                                                    handleBuy(item.id)
                                                }
                                            >
                                                Buy
                                            </Button>
                                            {userRole === "Administrator" && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        sx={{
                                                            fontSize: "1.2rem",
                                                            marginLeft: 1,
                                                        }}
                                                        onClick={() =>
                                                            handleUpdate(item)
                                                        }
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        sx={{
                                                            fontSize: "1.2rem",
                                                            marginLeft: 1,
                                                        }}
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            component={RouterLink}
                                            to="/login"
                                            sx={{ fontSize: "1.2rem" }}
                                        >
                                            Login first!
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmationModal
                open={isBuyModalOpen}
                onClose={() => setBuyModalOpen(false)}
                onConfirm={handleConfirmBuy}
                title="Buy Equipment"
                description="Do you really want to buy this equipment?"
            />

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Equipment"
                description="Do you really want to delete this equipment?"
            />

            {selectedEquipment && (
                <UpdateEquipmentModal
                    open={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onSubmit={handleConfirmUpdate}
                    initialData={{
                        name: selectedEquipment.name,
                        price: selectedEquipment.price,
                    }}
                />
            )}
        </>
    );
};

export default HomeBrewingEquipment;