import HttpUtil from "./HttpUtil.js";
import { useRouter } from "next/router.js";

export default class SignupService {
  constructor() {
    this.router = useRouter();
  }

  async createAccount(payload) {
    console.log("service => "+payload);
    try {
      let url = "http://localhost:8080/user";
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