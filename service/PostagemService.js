import HttpUtil from "./HttpUtil.js";

export default class PostagemService {
  async listAll() {
    try {
      let url = "http://localhost:8080/postagem";
      return await HttpUtil.get(url);
    } catch(error) {
      if (error.response && error.response.status === 404) {
        throw error;
      } else {
        throw error;
      }
    }
  }

  async createPostagem(payload) {
    console.log("service => "+payload);
    try {
      let url = "http://localhost:8080/postagem";
      return await HttpUtil.post(url, payload);
    } catch(error) {
      if (error.response && error.response.status === 404) {
        throw error;
      } else {
        throw error;
      }
    }
  }
}