import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/files.css";
import { Alert, Snackbar } from "@mui/material";
import { generateHmac } from "../hooks/generateHmac";

const baseURL = () => {
  const apiUrl = process.env.REACT_APP_API
    ? process.env.REACT_APP_API
    : "http://localhost:3001";
  return apiUrl;
};

const getInstance = () => {
  return axios.create({
    baseURL: baseURL(),
  });
};

const Message = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [message, setMessage] = useState("");

  const [Snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // send message
  const sendMessage = async () => {
    const token = await getAccessTokenSilently();

    if (message.length > 0) {
      await getInstance()
        .post(
          `${baseURL()}/message`,
          {
            message: message.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // send users id through headers
              userid: user.email,
              // send hmac through headers
              signature: generateHmac(message.trim()),
            },
          }
        )
        .then((res) => {
          // open snackbar
          setSnack({
            open: true,
            message: "Message sent successfully",
            severity: "success",
          });

          // clear message
          setMessage("");
        })
        .catch((err) => {
          // open snackbar
          setSnack({
            open: true,
            message: "You are unauthorized to send message",
            severity: "error",
          });

          // clear message
          setMessage("");
        });
    } else {
      // open snackbar
      setSnack({
        open: true,
        message: "Message can not be empty",
        severity: "error",
      });
    }
  };

  return (
    <div className="message_div">
      <div className="message_header">
        <div
          style={{
            display: "flex",
            justifyContent: "start",
          }}
        >
          <h2>Send Message</h2>
          <Button
            size="small"
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              height: "40px",
              marginTop: "18px",
            }}
          >
            <SendIcon />
          </Button>
        </div>

        <div>
          <textarea
            className="text_input"
            placeholder="Enter Message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength="1000"
            style={{
              fontFamily: "Roboto",
            }}
          />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Snack.open}
        onClose={() => setSnack({ open: false, message: "", severity: "" })}
        autoHideDuration={6000}
      >
        <Alert severity={Snack.severity} sx={{ width: "100%" }}>
          {Snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Message;
