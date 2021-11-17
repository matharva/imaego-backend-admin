import { logout } from "../App";

export function authHeader() {
  // return authorization header with jwt token
  let token = localStorage.getItem("accessToken");

  if (token) {
    return "Bearer " + token;
  } else {
    return "";
  }
}

export function checkLogin(res) {
  // console.log(res)
  // if(res.status == 401){
  //     logout();
  // }
}
