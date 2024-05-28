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

interface RecipeDto {
    id: string;
    title: string;
    description: string;
    brewerName: string;
    cookingPrice: number;
}

interface HomeRecipesProps {
    data: RecipeDto[];
}

const HomeRecipes: React.FC<HomeRecipesProps> = ({ data }) => {
    const userRole = localStorage.getItem("userRole");
    const isLogged = localStorage.getItem("bearer") !== null;

    const handleBuy = (id: string) => {
        console.log(`Buy Recipe with id: ${id}`);
    };

    const handleUpdate = (id: string) => {
        console.log(`Update Recipe with id: ${id}`);
    };

    const handleDelete = (id: string) => {
        console.log(`Delete Recipe with id: ${id}`);
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: "1.5rem" }}>Title</TableCell>
                        <TableCell sx={{ fontSize: "1.5rem" }}>
                            Description
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.5rem" }}>
                            Brewer
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.5rem" }}>
                            Cooking Price
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
                                    to={`/recipe/${item.id}`}
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    {item.title}
                                </Link>
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                {item.description}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                {item.brewerName}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                ${item.cookingPrice}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1.5rem" }}>
                                {isLogged ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ fontSize: "1.2rem" }}
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
                                                        fontSize: "1.2rem",
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
                                                        fontSize: "1.2rem",
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
    );
};

export default HomeRecipes;
