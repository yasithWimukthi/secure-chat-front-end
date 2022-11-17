import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/files.css";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { generateHmac } from "../hooks/generateHmac";
const CryptoJS = require("crypto-js");

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

  const [isLoading, setIsLoading] = useState(false);

  const [Snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // send message
  const sendMessage = async () => {
    setIsLoading(true);
    const token = await getAccessTokenSilently();

    if (message.length > 0) {
      const formattedMessage = await formatMessage(message);
      const encryptedMessage = await encryptMessage(formattedMessage);

      await getInstance()
        .post(
          `${baseURL()}/message`,
          {
            message: encryptedMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // send users id through headers
              userid: user.email,
              // send hmac through headers
              signature: generateHmac(encryptedMessage.trim()),
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
        })
        .finally(() => {
          setIsLoading(false);
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

  // prevent XSS attack in javascript.
  const formatMessage = async (message) => {
    return await message
      .replace(/\&/g, "&amp;")
      .replace(/\</g, "&lt;")
      .replace(/\>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/\'/g, "&#x27")
      .replace(/\//g, "&#x2F")
      .trim();
  };

  const encryptMessage = async (message) => {
    var ciphertext = CryptoJS.AES.encrypt(
      message,
      process.env.REACT_APP_AES_SECRET
    ).toString();
    return ciphertext;
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
            disabled={isLoading}
            size="small"
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              height: "40px",
              marginTop: "18px",
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
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
