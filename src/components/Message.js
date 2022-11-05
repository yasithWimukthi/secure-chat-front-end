import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/files.css";

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

  // send message
  const sendMessage = async () => {
    const token = await getAccessTokenSilently();

    if (message.length > 0) {
      const response = await getInstance().post(
        `${baseURL()}/message`,
        {
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // send users id through headers
            userid: user.email,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        setMessage("");
      }
    }
  };

  return (
    <div className="file_manager_div">
      <div className="file_manager_header">
        <div>
          <h2>Send Message</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <input
            className="text_input"
            placeholder="Enter Message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button size="small" onClick={sendMessage}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Message;
