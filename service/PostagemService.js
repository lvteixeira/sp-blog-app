import HttpUtil from "./HttpUtil";

export default class PostagemService {
  baseUrl = "http://localhost:8080/postagem";

  async listAll() {
    try {
      return await HttpUtil.get(this.baseUrl);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  async createPostagem(payload) {
    try {
      return await HttpUtil.post(this.baseUrl, payload);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  async getById(id) {
    try {
      const url = `${this.baseUrl}/${id}`;
      return await HttpUtil.get(url);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  async updatePostagem(payload, id) {
    try {
      const url = `${this.baseUrl}/${id}`;
      return await HttpUtil.put(url, payload);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  async deletePostagem(id) {
    try {
      const url = `${this.baseUrl}/${id}`;
      return await HttpUtil.delete(url);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if(error.response && error.response.status === 404) {
      console.error("Resource not found:", error.response);
    } else {
      console.error("An error occurred:", error);
    }
    throw error;
  }
}