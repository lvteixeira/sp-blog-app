import HttpUtil from "./HttpUtil";

export default class SignupService {
  baseUrl = "http://localhost:8080/user";

  async createAccount(payload) {
    try {
      return await HttpUtil.post(this.baseUrl, payload);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    console.error("Error creating account:", error);
    throw error;
  }
}
