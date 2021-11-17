import axios from "axios";
import { authHeader } from "./authHeaders";

export const server = axios.create({
  // baseURL: 'https://imaego-api.odinflux.com/',
  baseURL: "http://localhost:8011",
  responseType: "json",
  headers: {
    Authorization: authHeader(),
  },
});
