import { Alert, CircularProgress, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DeleteOutline, Download } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/files.css";
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

const FileManage = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const [Files, setFiles] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFileForDel, setselectedFileForDel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [Snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const getFiles = async () => {
    const token = await getAccessTokenSilently();

    const response = await getInstance().get(`${baseURL()}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // send users id through headers
        userid: user.email,
      },
    });

    setFiles(response.data);
  };

  useEffect(() => {
    // getFiles();
  }, []);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    const token = await getAccessTokenSilently();
    // const encryptedFile = await encryptFile(file);

    var reader = await new FileReader();
    reader.onload = async () => {
      var wordArray = await CryptoJS.lib.WordArray.create(reader.result); // Convert: ArrayBuffer -> WordArray
      var encrypted = await CryptoJS.AES.encrypt(
        wordArray,
        process.env.REACT_APP_AES_SECRET
      ).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
      // var encryptedFile = await new Blob([encrypted]); // Create blob from string

      const body = { file: encrypted };

      const res = await validateSelectedFile(file);

      console.log(res);
      if (res == true) {
        const response = await getInstance()
          .post(`${baseURL()}/upload`, body, {
            headers: {
              Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",

              // send users id through headers
              userid: user.email,
            },
          })
          .then((res) => {
            console.log("uploaded");
            // open snackbar
            setSnack({
              open: true,
              message: "File uploaded successfully",
              severity: "success",
            });
          })
          .catch((err) => {
            // open snackbar
            setSnack({
              open: true,
              message: "You are unauthorized to upload files",
              severity: "error",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });

        // //clear input
        // document.getElementById("file").value = "";
      }
      //clear input
      document.getElementById("file").value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  const validateSelectedFile = (file) => {
    const MAX_FILE_SIZE = 5120; // 5MB

    console.log("start size check");

    const fileSizeKiloBytes = file.size / 1024;
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      // open snackbar
      setSnack({
        open: true,
        message: "File size is greater than maximum limit",
        severity: "error",
      });
      console.log("size not ok");
      return false;
    }
    console.log("size ok");
    return true;
  };

  const encryptFile = async (file) => {
    var reader = await new FileReader();
    reader.onload = async () => {
      var key = "1234567887654321";
      var wordArray = await CryptoJS.lib.WordArray.create(reader.result); // Convert: ArrayBuffer -> WordArray
      var encrypted = await CryptoJS.AES.encrypt(wordArray, key).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

      var fileEnc = await new Blob([encrypted]); // Create blob from string

      // console.log(encrypted);
      console.log(fileEnc);
      return await fileEnc;
    };
    await reader.readAsArrayBuffer(file);
  };

  // async function decrypt(file) {
  //   await console.log(typeof file);
  //   await console.log(file);

  // var reader = new FileReader();
  //   reader.onload = () => {
  //     var key = "1234567887654321";

  //     var decrypted = CryptoJS.AES.decrypt(reader.result, key); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
  //     var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array

  //     var fileDec = new Blob([typedArray]); // Create blob from typed array

  //     return fileDec;
  //   };
  // reader.readAsText(file);
  // }

  const handleFileDelete = async () => {
    const token = await getAccessTokenSilently();

    if (selectedFileForDel) {
      const response = await getInstance().delete(
        `${baseURL()}/files/${selectedFileForDel}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // send users id through headers
            userid: user.email,
          },
        }
      );

      if (response.data) {
        getFiles();
        setselectedFileForDel("");
        setOpenDialog(false);
      }
    }
  };

  return (
    <div className="file_manager_div">
      <div className="file_manager_header">
        <div>
          <h2>File Storage </h2>
        </div>
        <div>
          <label className="file_manager_upload_input_btn">
            <input
              disabled={isLoading}
              id="file"
              type="file"
              // allowedExtensions=".doc, .docx, .xls, .xlsx"
              // maxFileSize={28400000}
              accept=".doc, .docx, .xls, .xlsx, .pdf"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <CircularProgress
              size={20}
              style={{
                display: isLoading ? "block" : "none",
                marginRight: "5px",
                marginTop: "3px",
                color: "white",
              }}
            />
            Upload
          </label>
        </div>
      </div>

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

export default FileManage;
