import HttpUtil from "./HttpUtil.js";
import { useRouter } from "next/router.js";

export default class SignupService {
  constructor() {
    this.router = useRouter();
  }

  async createAccount(payload) {
    try {
      let url = "http://localhost:8080/user";
      return await HttpUtil.post(url, payload);
    } catch(error) {
      if (error.response && error.response.status === 404) {
        // Se a resposta for um erro 404, redirecionar para a página 404
        this.router.push('/404');
      } else {
        // Outros erros podem ser tratados de forma diferente ou simplesmente lançados novamente
        this.router.push('/404');
      }
    }
  }
}