const BASE_URL = "http://localhost:8080/api/v1/";

export const endpoints = {
  SIGNUP_API: BASE_URL + "auth/register",
  LOGIN_API: BASE_URL + "auth/login",
  LOGOUT_API: BASE_URL + "auth/logout",
  CONNECTIONS_API: BASE_URL + "chat/connections",
  CHAT_API_ALL: BASE_URL + "chat/history/all",
  CHAT_API_SINGLE: BASE_URL + "chat/history/single",
  SEARCH_USER_API: BASE_URL + "search/user",
  USER_PROFILE_API : BASE_URL + "search/user-profile",
};
