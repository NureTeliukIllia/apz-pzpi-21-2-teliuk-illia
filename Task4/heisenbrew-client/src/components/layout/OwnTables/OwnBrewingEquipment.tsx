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

export interface OwnBrewingEquipmentDto {
    id: string;
    name: string;
    isBrewing: boolean;
}

export interface OwnBrewingEquipmentProps {
    data: OwnBrewingEquipmentDto[];
}

const OwnBrewingEquipment: React.FC<OwnBrewingEquipmentProps> = ({ data }) => {
    const handleManageBrewings = (id: string) => {
        console.log(`Manage brewings on Equipment with id: ${id}`);
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ fontSize: "1.5rem" }}>
                            Name
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "1.5rem" }}>
                            Is Brewing
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "1.5rem" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell
                                align="center"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                {item.name} ({item.id.split("-")[0]})
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    fontSize: "1.5rem",
                                }}
                            >
                                {item.isBrewing ? "🟢" : "🔴"}
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontSize: "1.5rem" }}
                            >
                                <Link
                                    component={RouterLink}
                                    to={`/my-equipment/${item.id}`}
                                >
                                    {" "}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ fontSize: "1.2rem" }}
                                        onClick={() =>
                                            handleManageBrewings(item.id)
                                        }
                                    >
                                        Manage Brewings
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OwnBrewingEquipment;
