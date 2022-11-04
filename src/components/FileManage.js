import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DeleteOutline, Download } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { API } from "../api/api";
import "../styles/files.css";
const FileManage = () => {
  const [Manager, setManager] = useState(true);
  const [Files, setFiles] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFileForDel, setselectedFileForDel] = useState(false);

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

  // const handleClickOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  const handleFileDelete = async () => {
    if (selectedFileForDel) {
      const response = await API.deleteFile(selectedFileForDel);

      if (response) {
        getFiles();
        setselectedFileForDel("");
        setOpenDialog(false);
      }
    }
  };

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
                        style={{
                          marginRight: "20px",
                        }}
                      >
                        <Download
                          style={{
                            color: "rgba(79, 147, 206, 0.300)",
                          }}
                        />
                      </IconButton>

                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setselectedFileForDel(file.name);
                          setOpenDialog(true);
                        }}
                        style={{
                          marginRight: "20px",
                        }}
                      >
                        <DeleteOutline
                          style={{
                            color: "rgba(79, 147, 206, 0.200)",
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
        {/* Dialog for delete file */}

        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setselectedFileForDel("");
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this file?"}
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setselectedFileForDel("");
              }}
            >
              Cancel
            </Button>
            <Button color="error" onClick={handleFileDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  else return <></>;
};

export default FileManage;
