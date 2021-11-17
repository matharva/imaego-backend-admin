import { checkLogin } from "../utils/authHeaders";
import { server } from "../utils/server"

export function getHomeVideos() {
    return server.get("/homepage/get")
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function setActiveVideo(id) {
    return server.post("/homepage/update",{"homepage_id":id})
    
    .then(response => {
        return response.data;
    }).catch(error => {
        checkLogin(error.response);
        return null;
    })
}

export function addVideo(id) {
    return server.post("/homepage/add",{"image_id":id,"active":false})
    
    .then(response => {
        return response.data;
    }).catch(error => {
        checkLogin(error.response);
        return null;
    })
}

export function deleteVideo(id) {
    return server.post("/homepage/delete",{"homepage_id":id})
    
    .then(response => {
        return response.data;
    }).catch(error => {
        checkLogin(error.response);
        return null;
    })
}