// services/apiClientNoAuth.ts
import axios from "axios";

const apiClientNoAuth = axios.create({
  baseURL: "http://192.168.1.134:8090", // adresa API Gateway
  headers: { "Content-Type": "application/json" },
});

// fără interceptor → NU pune Authorization

export default apiClientNoAuth;
//172.20.10.5
//192.168.1.134
//10.216.100.21
//
