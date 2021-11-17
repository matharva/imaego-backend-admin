import { server } from "../utils/server";

const authService = {
    signupUser,
    loginUser,
}

function loginUser(data, setError){
  return server.post("admin/login", data)
    .then(function (response) {
      // handle success
      // console.log(response);
      const tokenData = response.data.details.token
      console.log(tokenData)
      localStorage.setItem("accessToken", tokenData.access.token)
      localStorage.setItem("refreshToken", tokenData.refresh.token)
      return response.data.error
      
    })
    .catch(function (error) {
      // handle error
      console.log(error.response.data.details.message)
      setError(error.response.data.details.message);
      return error.response.data.error
    })
}

function signupUser(data, setError){
    return server.post("admin/signup", data)
          .then(function (response) {
            // handle success
            // console.log(response);
            const tokenData = response.data.details.token
            console.log(tokenData)
            localStorage.setItem("accessToken", tokenData.access.token)
            localStorage.setItem("refreshToken", tokenData.refresh.token)
            
          })
          .catch(function (error) {
            // handle error
            setError(error.response.data.details.message);
            console.log(error.response.data.details.message)
          })
}

export default authService