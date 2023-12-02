import {
  Divider,
  FormControl,
  InputLabel,
  List, ListItem,
  ListItemButton, ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React from "react";

const SpecialityList = ({
  departments,
  department,
  setDepartment,
  filterData,
  setFilterData,
  specialities,
  setSpeciality,
  loading
}) => {
  return <>
    <div
      style={{
        width: "350px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        boxShadow: "5px 0px 10px 0px rgba(0,0,0,0.25)",
        zIndex: "300"
      }}
    >
      <TextField
        style={{
          margin: "10px 15px"
        }}
        // disabled={loading}
        variant="standard"
        id="search-request"
        label="Пошук..."
        value={filterData.title}
        onChange={(e) => {setFilterData({ ...filterData, ["title"]: e.target.value });}}
      />
      <Typography
        align="center"
        variant="p"
        sx={{
          color: "#a0a0a0",
          margin: "10px"
        }}
      >
        або
      </Typography>
      <FormControl
        disabled={loading}
        style={{
          margin: "10px 15px"
        }}
      >
        <InputLabel id="department-select-label">Відділ</InputLabel>
        <Select
          labelId="department-select-label"
          id="department-select"
          label="Відділ"
          value={department || "any"}
          onChange={(e) => {setDepartment(e.target.value !== "any" ? e.target.value : null);}}
        >
          <MenuItem value="any">Будь-який</MenuItem>
          {departments && departments.map((dep, key) => (
            <MenuItem value={dep}>{dep.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider
        sx={{ marginTop: "10px" }}
      />
      <div
        style={{
          overflowY: "scroll"
        }}
      >
        <List>
          {specialities && specialities.map((spec, key) => (
            <ListItem disablePadding>
              <ListItemButton disabled={loading} onClick={(e) => {setSpeciality({ id: spec.id, title: spec.title });}}>
                <ListItemText primary={spec.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  </>;
};

export default SpecialityList;


