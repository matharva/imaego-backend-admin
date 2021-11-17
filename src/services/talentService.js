import { checkLogin } from "../utils/authHeaders";
import { server } from "../utils/server";
import { projectFirestore, projectStorage } from "../firebase";

export function getTalent() {
  return server
    .get("/talent/get")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function getGalleryImages() {
  return server
    .get("/images/get")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function addTalent(data) {
  return server
    .post("/talent/add", data)

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function addGalleryImages(data) {
  console.log(data);
  for (var v in data) {
    console.log(v);
  }
  //   const storageRef = projectStorage.ref(file.name);
  //   console.log(projectStorage, file.name);
  //   // const collectionRef = projectFirestore.collection("images");

  //   storageRef.put(file).on("state_changed", async () => {
  //     const URL = await storageRef.getDownloadURL();

  //     console.log("URL for notif: ", URL);
  //   });

  return server
    .post("/images/add", data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function deleteGalleryImages(id) {
  const data = {
    id: id,
  };
  console.log(data);

  return server
    .delete("/images/delete", { data })

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function deleteTalent(id) {
  const data = {
    id: id,
  };
  console.log(data);

  return server
    .delete("/talent/delete", { data })

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function updateTalent(data) {
  console.log(data);
  return server
    .patch("/talent/update", data)

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function addImage(data) {
  return server
    .post("/talent/images/add", data)

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function deleteImages(id) {
  const data = {
    id: id,
  };
  console.log(data);

  return server
    .delete("/talent/images/delete", { data })

    .then((response) => {
      return response;
    })
    .catch((error) => {
      checkLogin(error.response);
      return error;
    });
}

export function changeSequence(dataToBeSent) {
  const data = {
    sequenceData: dataToBeSent,
  };

  return server
    .post("/talent/sequence", data)

    .then((response) => {
      return response;
    })
    .catch((error, r) => {
      checkLogin(error.response);
      return error;
    });
}
