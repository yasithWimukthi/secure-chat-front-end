import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MenuItem, Select } from "@mui/material";

export const Admin = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [Users, setUsers] = useState([]);
  const [Roles, setRoles] = useState([]);

  const getUsers = async () => {
    const response = await axios.get(
      "https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/users",
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
        },
      }
    );

    let Users = [];

    //add user role to each user
    for (let i = 0; i < response.data.length; i++) {
      const user = response.data[i];

      const userRole = await axios.get(
        `https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/users/${user.user_id}/roles`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
          },
        }
      );

      user.role = userRole.data[0]?.name;

      // check for admin
      //   if (userRole.data[0]?.name !== "admin")
      Users.push(user);
    }

    setUsers(Users);
  };

  // get user roles
  const getRoles = async () => {
    const response = await axios.get(
      "https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/roles",
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
        },
      }
    );

    setRoles(response.data);
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  // update user role
  const updateUserRole = async (user, role) => {
    // get the new role id
    const newRoleID = Roles.find((r) => r.name === role).id;

    // check if the user has a role
    if (user.role) {
      // get the user role id
      const oldRoleID = Roles.find((r) => r.name === user.role).id;

      //   first remove all roles from the user be
      var data = JSON.stringify({
        roles: [oldRoleID],
      });

      var config = {
        method: "delete",
        url: `https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/users/${user.user_id}/roles`,
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config);
    }

    // add the new role
    await axios.post(
      `https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/users/${user.user_id}/roles`,
      {
        roles: [newRoleID],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
        },
      }
    );

    getUsers();
  };

  return (
    <div>
      <h1>User Management</h1>
      {/* update auth0 user roles */}

      <TableContainer component={Paper} sx={{ maxWidth: "90%" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Nickname</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Login Counts</TableCell>
              <TableCell align="right">Create At</TableCell>
              <TableCell align="right">last Login</TableCell>
              <TableCell align="right">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Users.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.nickname}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.logins_count}</TableCell>
                <TableCell align="right">
                  {Date(row.created_at).toLocaleString().slice(0, 15)}
                </TableCell>
                <TableCell align="right">
                  {Date(row.last_login).toLocaleString().slice(0, 15)}
                </TableCell>
                <TableCell align="right">
                  {
                    // select role
                    <Select
                      defaultValue={row.role}
                      value={row.role}
                      onChange={(e) => updateUserRole(row, e.target.value)}
                    >
                      {Roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
