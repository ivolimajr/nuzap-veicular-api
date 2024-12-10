import axios from "axios";
import jwt from "jsonwebtoken";
import CustomException from "../../../config/CustomException.js";

class EspApiServices {
  #client;
  #token = null;
  #tokenExpiresAt = 0;
  #EPS_BASE_URL;
  #EPS_CLIENT_ID;
  #EPS_CLIENT_SECRET;
  #EPS_API_AUTH_VERSION;
  #EPS_API_VERSION;

  constructor() {
    this.#initProperties();
    this.#client = axios.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        charset: "utf-8",
        responseEncoding: "utf8",
      },
    });
    this.#authInterceptor();
  }

  async checkPlate({ plate }) {
    try {
      await this.#setToken();
      const url = `${this.#EPS_BASE_URL}/api/${this.#EPS_API_VERSION}/ConsultaPlaca`;
      const result = await this.#client.post(url,{
        placa: plate
      });
      return result.data;
    } catch (error) {
      console.log(error);
      throw new CustomException(error.status,error.message,"Falha na consulta de placa")
    }
  }
  async checkOrder({ numeroPedido }) {
    try {
      await this.#setToken();
      const url = `${this.#EPS_BASE_URL}/api/${this.#EPS_API_VERSION}/pagamento/ConsultarStatusPedido?CodigoPedido=${numeroPedido}`;
      const result = await this.#client.get(url);
      return result.data;
    } catch (error) {
      throw new CustomException(error.status,error.message,"Falha na consulta de débitos")
    }
  }

  async #setToken() {
    if (this.#token && this.#tokenExpiresAt > Date.now()) return this.#token;
    try {
      await this.#generateToken();
    } catch (error) {
      throw error
    }
  }

  async #generateToken() {
    try {
      const url = `${this.#EPS_BASE_URL}/login/${this.#EPS_API_AUTH_VERSION}/login`;
      const result = await this.#client.post(url, {
        email: this.#EPS_CLIENT_ID,
        senha: this.#EPS_CLIENT_SECRET,
      });
      this.#setTokenProperties({ token: result.data.token });
      return result.data.token;
    } catch (error) {
      console.error(error)
      throw new CustomException(error.status,error.message,"Falha na autenticação")
    }
  }

  #setTokenProperties({ token }) {
    if (token) {
      this.#token = token;
      const decode = jwt.decode(token);
      this.#tokenExpiresAt = Date.now() + decode.exp * 1000;
    } else {
      this.#token = null;
      this.#tokenExpiresAt = 0;
    }
  }

  #initProperties() {
    this.#EPS_BASE_URL = process.env.EPS_BASE_URL;
    this.#EPS_CLIENT_ID = process.env.EPS_CLIENT_ID;
    this.#EPS_CLIENT_SECRET = process.env.EPS_CLIENT_SECRET;
    this.#EPS_API_VERSION = process.env.EPS_API_VERSION;
    this.#EPS_API_AUTH_VERSION = process.env.EPS_API_AUTH_VERSION;
  }

  #authInterceptor() {
    this.#client.interceptors.request.use((config) => {
      if (this.#token) config.headers.Authorization = `Bearer ${this.#token}`;
      return config;
    });
  }
}

export default new EspApiServices();
