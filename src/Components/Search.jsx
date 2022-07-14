import React from 'react'
import Box from '@mui/material/Box';
import { FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import { Select } from '@mui/material';

export default function Search() {
    const [text, setText] = useState("react");
    const [data, setData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [load, setLoad] = useState(true);
    const [sort, setSort] = useState("");

    const fetchData = (name) => {
        return axios.get(`https://api.github.com/search/repositories?q=${name}`)
    };

    useEffect(() => {
        setLoad(true);
        fetchData("react").then(res => {
            setData(res.data.items);
            setLoad(false)
        });
    }, [])

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleSort = (e) => {
        setSort(e.target.value);
    }

    const handleSearch = () => {
        setLoad(true);
        fetchData(text).then(res => {
            setData(res.data.items);
            setLoad(false);
        });
    }

    const columns = [
        { id: 'name', label: 'Name', minWidth: 70 },
        { id: 'full_name', label: 'Full Name', minWidth: 170 },
        {
            id: 'forks',
            label: 'Forks',
            minWidth: 50,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'language',
            label: 'Language',
            minWidth: 70,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'visibility',
            label: 'Visibility',
            minWidth: 70,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
    ];

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const sortData = (type) =>{
        setLoad(true)
        axios.get(`https://api.github.com/search/repositories?q=${text}&sort=forks&order=${type}`).then(res => {
            setData(res.data.items);
            setLoad(false);
        });
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                {load === true ? <LinearProgress sx={{
                    backgroundColor: "#1976d2", "& .MuiLinearProgress-bar": {
                        backgroundColor: `#fae0a7`
                    }
                }} /> : ""}
            </Box>

            <Box sx={{ padding: "50px", display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ width: "30%", height: "500px", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <TextField
                        id="outlined-name"
                        label="Search Repo"
                        value={text}
                        onChange={handleChange}
                        sx={{ marginLeft: "70px", marginTop: "70px" }}
                    />
                    <Button variant="contained"
                        sx={{
                            marginTop: "10px",
                            marginLeft: "70px",
                            paddingLeft: "80px",
                            paddingRight: "80px",
                        }}

                        onClick={() => {
                            handleSearch();
                        }}
                    >Search</Button>
                    <div style={{ marginTop: "20px" }}>
                        <FormControl sx={{
                            m: 1,
                            minWidth: 190,
                            marginTop: "10px",
                            marginLeft: "0px",
                            paddingLeft: "90px",
                            paddingRight: "90px",
                        }} size="small">
                            <InputLabel sx={{
                                marginLeft: "90px"
                            }} id="demo-select-small">Sort By Forks</InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={sort}
                                label="Sort By Forks"
                                onChange={handleSort}
                            >
                                <MenuItem onClick={() =>{sortData("asc")}} value={"Ascending"}>Ascending</MenuItem>
                                <MenuItem onClick={() =>{sortData("desc")}} value={"Descending"}>Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                </Box>
                <Box sx={{
                    width: "65%"
                }}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, backgroundColor: "#1976d2", color: "white", fontWeight: "700" }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 30]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </Box>
        </>
    )
}
