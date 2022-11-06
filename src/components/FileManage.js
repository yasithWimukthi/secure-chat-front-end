import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "../styles/files.css";
import { DeleteOutline, Download } from "@mui/icons-material";
import { API } from "../api/api";
import SriPlugin from "webpack-subresource-integrity";

const FileManage = () => {
  const [Manager, setManager] = useState(true);
  const [Files, setFiles] = useState([]);

  const getFiles = async () => {
    const files = await API.getFiles();
    setFiles(files);
  };

  useEffect(() => {
    getFiles();
  }, []);

  const handleFileUpload = async (index) => {
    const response = await API.uploadFile(index);

    if (response) {
      getFiles();
    }

    //clear input
    document.getElementById("file").value = "";
  };

  const handleFileDelete = async (name) => {
    const response = await API.deleteFile(name);

    if (response) {
      getFiles();
    }
  };

  //data intergrity
  const compiler = webpack({
    output: {
      crossOriginLoading: "anonymous",
    },
    plugins: [
      new SriPlugin({
        hashFuncNames: ["sha256", "sha384"],
        enabled: process.env.NODE_ENV === "production",
      }),
    ],
  });

  if (Manager)
    return (
      <div className="file_manager_div">
        <div className="file_manager_header">
          <div>
            <h2>File Storage</h2>
          </div>
          <div>
            <label className="file_manager_upload_input_btn">
              <input
                id="file"
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
              Upload
            </label>
          </div>
        </div>
        <div className="file_manager_body">
          <List>
            {Files.map((file, key) => (
              <>
                <ListItem
                  key={key}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => {
                          //download base64 file acording to file type
                          const link = document.createElement("a");
                          link.href = `data:${file.type};base64,${file.file}`;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        <Download
                          style={{
                            color: "rgba(79, 147, 206, 0.303)",
                          }}
                        />
                      </IconButton>
                      {"   "}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleFileDelete(file.name)}
                      >
                        <DeleteOutline
                          style={{
                            color: "#34282f",
                          }}
                        />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon
                      style={{
                        color: "#282c34",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>
              </>
            ))}
          </List>
        </div>
      </div>
    );
  else return <></>;
};

export default FileManage;
