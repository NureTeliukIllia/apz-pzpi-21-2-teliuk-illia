import React from "react";
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

interface IngredientDto {
    id: string;
    name: string;
    price: number;
}

interface IngredientProps {
    data: IngredientDto[];
}

const Ingredient: React.FC<IngredientProps> = ({ data }) => {
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const handleBuy = (id: string) => {
        console.log(`Buy Ingredient with id: ${id}`);
    };

    const handleUpdate = (id: string) => {
        console.log(`Update Ingredient with id: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete Ingredient with id: ${id}`);
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: "2rem" }}>Name</TableCell>
                        <TableCell sx={{ fontSize: "2rem" }}>Price</TableCell>
                        <TableCell sx={{ fontSize: "2rem" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell sx={{ fontSize: "2rem" }}>
                                {item.name}
                            </TableCell>
                            <TableCell sx={{ fontSize: "2rem" }}>
                                {item.price}
                            </TableCell>
                            <TableCell>
                                {isLogged ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ fontSize: "2rem" }}
                                            onClick={() => handleBuy(item.id)}
                                        >
                                            Buy
                                        </Button>
                                        {userRole === "Administrator" && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{
                                                        fontSize: "2rem",
                                                        marginLeft: 1,
                                                    }}
                                                    onClick={() =>
                                                        handleUpdate(item.id)
                                                    }
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{
                                                        fontSize: "2rem",
                                                        marginLeft: 1,
                                                    }}
                                                    onClick={() =>
                                                        handleDelete(item.id)
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
                                        sx={{ fontSize: "2rem" }}
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
    );
};

export default Ingredient;
