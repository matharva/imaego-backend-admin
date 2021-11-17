import React, { useState, useEffect } from "react";
import { projectFirestore, projectStorage } from "../firebase";

// API service
import {
  addGalleryImages,
  getGalleryImages,
  deleteGalleryImages,
} from "../services/talentService";

// External Imports
import Modal from "react-modal";
import Masonry from "react-masonry-css";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const GalleryImagesModal = ({
  selected,
  showGallery,
  setShowGallery,
  hoverVideo,
  setHoverVideo,
  bannerImage,
  setBannerImage,
  footerImg1,
  setFooterImg1,
  footerImg2,
  setFooterImg2,
  footerImg3,
  setFooterImg3,
}) => {
  ////////////////////////////////////////////////////////////////////////////// State

  const [galleryImages, setGalleryImages] = useState([]);
  const [allowDelete, setAllowDelete] = useState(false);

  ////////////////////////////////////////////////////////////////////////////// useEffects

  // Gets images to display in the gallery image modal
  useEffect(() => {
    async function getGImages() {
      const images = await getGalleryImages();
      const galleryImagesArray = images.data.details.data;
      console.log("All gallery images", galleryImagesArray);
      setGalleryImages(galleryImagesArray);
    }
    getGImages();
  }, []);

  ////////////////////////////////////////////////////////////////////////////// Styles

  // Custom Styles for Modal
  const customStyles = {
    content: {
      backgroundColor: "#181818",
      zIndex: 999,
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
  };

  // Break Points for Masonry Grid
  const breakpointColumnsObj = {
    default: 7,
    1300: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  ////////////////////////////////////////////////////////////////////////////// Event Handlers

  // Sets the appropriate file type and updates the corresponding state
  // It is basically used to know that if a banner image is selected, then from the gallery images modal, it should be added to banner images itself
  function getAppropriateSetState(state, files, id, type) {
    console.log("Selected ", state, files, id, type);
    switch (state) {
      case ".img-preview":
        console.log("Video set as", files);
        setHoverVideo({
          ...hoverVideo,
          url: files,
          type: "video",
          id: id,
        });
        break;

      case ".banner-img-preview":
        console.log("Banner img set as", files);
        setBannerImage({
          ...bannerImage,
          url: files,
          type: "bannerImage",
          id: id,
        });
        break;

      case ".footer-preview1":
        console.log("Footer1 img set as", files);
        setFooterImg1({
          ...footerImg1,
          url: files,
          type: "footer1",
          id: id,
        });
        break;

      case ".footer-preview2":
        console.log("Footer2 img set as", files);
        setFooterImg2({
          ...footerImg2,
          url: files,
          type: "footer2",
          id: id,
        });
        break;

      case ".footer-preview3":
        console.log("Footer3 img set as", files);
        setFooterImg3({
          ...footerImg3,
          url: files,
          type: "footer3",
          id: id,
        });
        break;

      default:
        break;
    }
  }

  // Upload images to the gallery and render updated list of images
  function handleUploadInGallery(e) {
    const files = e.target.files[0];

    const storageRef = projectStorage.ref(files.name);

    storageRef.put(files).on("state_changed", async () => {
      let data = { urlLink: "", type: "" };
      const URL = await storageRef.getDownloadURL();

      console.log("URL for notif: ", URL);
      data.urlLink = URL;
      data.type = files.type;
      console.log("Data: ", data);
      addGImages(data);
    });

    async function addGImages(data) {
      const galleryResponse = await addGalleryImages(data);
      getGImages();
      console.log(galleryResponse);
    }

    async function getGImages() {
      const images = await getGalleryImages();
      const galleryImagesArray = images.data.details.data;
      setGalleryImages(galleryImagesArray);
    }
  }

  function handleImageDelete(id) {
    console.log(id);

    async function deleteImagesFromGallery() {
      const resp = await deleteGalleryImages(id);
      getGImages();
      console.log(resp);
    }
    deleteImagesFromGallery();

    async function getGImages() {
      const images = await getGalleryImages();
      const galleryImagesArray = images.data.details.data;
      setGalleryImages(galleryImagesArray);
    }
  }

  return (
    <div>
      {}
      <Modal isOpen={showGallery} style={customStyles}>
        <div className="modal__content">
          {/* Modal Header Starts */}
          <div className="modal__header">
            <h1>Gallery</h1>
            <div className="modal__add__imgBtn">
              {/* This input is hidden */}
              <input type="file" onChange={(e) => handleUploadInGallery(e)} />
              Add Items
            </div>
            <div
              className="modal__add__imgBtn"
              onClick={() => setAllowDelete(!allowDelete)}
            >
              {allowDelete ? "Cancel" : "Delete Images"}
            </div>
          </div>
          <div
            className="modal__closeBtn"
            onClick={() => setShowGallery(false)}
          >
            Close
          </div>
          {/* Modal Header Ends */}
          <Masonry
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            breakpointCols={breakpointColumnsObj}
          >
            {/* <div className="gallery__grid"> */}

            {galleryImages.map((item) => {
              return (
                <div
                  className="gallery__grid__item"
                  key={item.id}
                  onClick={(e) => {
                    if (allowDelete) return;
                    getAppropriateSetState(
                      selected,
                      item.key,
                      item.id,
                      item.type
                    );
                    setShowGallery(false);
                  }}
                >
                  {item.type === "VIDEO" ? (
                    <video
                    //   onMouseOver={(event) => event.target.play()}
                    //   onMouseOut={(event) => {
                    //     event.target.pause();
                    //     event.target.currentTime = 0;
                    //   }}
                    //   loop
                    >
                      <source src={item.key} />
                    </video>
                  ) : (
                    <img src={item.key} alt="" className="gallery__grid__img" />
                  )}
                  {allowDelete ? (
                    <div
                      className="gallery__grid__item__icon"
                      onClick={() => handleImageDelete(item.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Masonry>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryImagesModal;
