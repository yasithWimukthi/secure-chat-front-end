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
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Alert, Snackbar } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";

export const Admin = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [Users, setUsers] = useState([]);
  const [Roles, setRoles] = useState([]);
  const [openCreateNewUser, setOpenCreateNewUser] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [Snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  const getUsers = async () => {
    setIsLoading(true);

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
      if (userRole.data[0]?.name !== "admin") Users.push(user);
    }

    setUsers(Users);
    setIsLoading(false);
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

    // open snack bar
    setSnack({
      open: true,
      message: "User role updated successfully",
      severity: "success",
    });

    getUsers();
  };

  // auth0 email validation
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // auth0 password validation
  const validatePassword = (password) => {
    const passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

    return passwordRegex.test(password);
  };

  // create new user
  const createNewUser = async (email, password) => {
    // check required fields
    if (!email || !password) {
      setSnack({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    // check if the email is valid
    if (!validateEmail(email)) {
      setSnack({
        open: true,
        message: "Invalid email",
        severity: "error",
      });
      return;
    }

    // check if the password is valid
    if (!validatePassword(password)) {
      setSnack({
        open: true,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
        severity: "error",
      });
      return;
    }
    await axios
      .post(
        "https://dev-qup5pjoxhm8l63sb.us.auth0.com/api/v2/users",
        {
          connection: "Username-Password-Authentication",
          email: email,
          password: password,
          verify_email: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH0_MANAGEMENT_TOKEN}`,
          },
        }
      )
      .then(async (response) => {
        getUsers();
        setOpenCreateNewUser(false);

        // open snackbar
        setSnack({
          open: true,
          message: "User created successfully",
          severity: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        setOpenCreateNewUser(false);

        // open snackbar
        setSnack({
          open: true,
          message: "Error creating user",
          severity: "error",
        });
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
        }}
      >
        <h1>User Management</h1>{" "}
        <Button
          style={{ marginLeft: "15px", height: "35px", marginTop: "28px" }}
          variant="outlined"
          onClick={() => setOpenCreateNewUser(true)}
        >
          Create new user
        </Button>
        <Dialog
          open={openCreateNewUser}
          onClose={() => setOpenCreateNewUser(false)}
        >
          <DialogTitle>Create a new user</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateNewUser(false)}>Cancel</Button>
            <Button
              onClick={() => {
                createNewUser(newUser.email, newUser.password);
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* update auth0 user roles */}
      {isLoading ? (
        <CircularProgress
          size={20}
          style={{
            display: isLoading ? "block" : "none",
            marginRight: "5px",
            marginTop: "3px",
            color: "white",
          }}
        />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: "95%" }}>
          <Table sx={{ minWidth: 650 }}>
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
                        disabled={isLoading}
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
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Snack.open}
        onClose={() => {
          setSnack({ open: false, message: "", severity: "" });
        }}
        autoHideDuration={6000}
      >
        <Alert severity={Snack.severity} sx={{ width: "100%" }}>
          {Snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
