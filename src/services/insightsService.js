import { checkLogin } from "../utils/authHeaders";
import { server } from "../utils/server"

export function getInsights() {
    return server.get("/blog/get")
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function addInsights(data) {
    return server.post("/blog/add", data)
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function deleteInsights(id) {
    const data = {
        id: id
      }
    console.log(data)

    return server.delete("/blog/delete", {data})
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function updateInsights(data) {

    console.log(data)
    return server.patch("/blog/update", data)
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function addImageForInsights(data) {

    return server.post("/blog/images/add", data)
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function deleteImagesForInsights(id) {
    const data = {
        id: id
      }
    console.log(data)

    return server.delete("/blog/images/delete", {data})
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}

export function changeSequence(dataToBeSent){
    const data = {
        sequenceData: dataToBeSent
    }


    return server.post("/blog/sequence", data)
    
    .then(response => {
        return response;
    }).catch(error => {
        checkLogin(error.response);
        return error;
    })
}