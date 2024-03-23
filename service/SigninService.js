import HttpUtil from "./HttpUtil.js";

export default class SigninService {
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