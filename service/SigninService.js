import HttpUtil from "./HttpUtil.js";
import { useRouter } from "next/router.js";

export default class SigninService {
  constructor() {
    this.router = useRouter();
  }

  async auth(payload) {
    console.log("service => "+payload);
    try {
      let url = "http://localhost:8080/user/"+payload['username']+"/auth?password="+payload['password'];
      return await HttpUtil.get(url);
    } catch(error) {
      if (error.response && error.response.status === 404) {
        throw error;
      } else {
        throw error;
      }
    }
  }
}