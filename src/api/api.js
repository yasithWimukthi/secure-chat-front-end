import axios from "axios";

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

export class API {
  // send file to node express server
  static async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", "dilshanhiruna");

    const response = await getInstance().post(`${baseURL()}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // send users id through headers
        userid: "dilshanhiruna",
      },
    });
    return response.data;
  }

  // get all files from node express server
  static async getFiles() {
    const response = await getInstance().get(`${baseURL()}/files`, {
      headers: {
        // send users id through headers
        userid: "dilshanhiruna",
      },
    });

    return response.data;
  }
  // delete file from node express server
  static async deleteFile(name) {
    const response = await getInstance().delete(`${baseURL()}/files/${name}`, {
      headers: {
        // send users id through headers
        userid: "dilshanhiruna",
      },
    });

    return response.data;
  }
}
