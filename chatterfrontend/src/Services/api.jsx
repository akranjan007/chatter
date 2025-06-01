const BASE_URL = "http://localhost:8080/api/v1/";

export const endpoints = {
  SIGNUP_API: BASE_URL + "auth/register",
  LOGIN_API: BASE_URL + "auth/login",
  LOGOUT_API: BASE_URL + "auth/logout",
  CONNECTIONS_API: BASE_URL + "chat/connections",
  CHAT_API: BASE_URL + "chat/history",
};
