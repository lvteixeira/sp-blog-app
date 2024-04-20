import HttpUtil from "./HttpUtil";

export default class SigninService {
  async auth(payload) {
    try {
      const url = `http://localhost:8080/user/${encodeURIComponent(payload.username, true)}/auth?password=${encodeURIComponent(payload.password, true)}`;
      return await HttpUtil.get(url);
    } catch(error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    console.error("An error occurred during authentication:", error);
    throw error;
  }
}