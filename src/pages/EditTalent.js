import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// API service
import { getTalent, updateTalent } from "../services/talentService"

// Components
import GalleryImagesModal from '../components/GalleryImagesModal'
import Editor from '../components/Editor'

// Styles
import "../styles/EditItems.css"

const EditItems = () => {
    const [hoverVideo, setHoverVideo] = useState({
        url: "",
        id: "",
        type: "",
    });
    const [bannerImage, setBannerImage] = useState({
        url: "",
        id: "",
        type: "",
    });
    const [footerImg1, setFooterImg1] = useState({
        url: "",
        id: "",
        type: "",
    });
    const [footerImg2, setFooterImg2] = useState({
        url: "",
        id: "",
        type: "",
    });
    const [footerImg3, setFooterImg3] = useState({
        url: "",
        id: "",
        type: "",
    });

    const [finalImages, setFinalImages] = useState([])
    const [playerDetails, setPlayerDetails] = useState({
        oneliner: "",  
        author: "",
        content: "",
        sequence: "",
        website: "",
        websiteHandle: "",
        instagram: "",
        instagramHandle: "",
        youtube: "",
        youtubeHandle: ""
      })

      const [selected, setSelected] = useState()
    const [ids, setIds] = useState()

    // const [playerDetails, setPlayerDetails] = useState([]); 
    const { id } = useParams();
    // const history = useHistory();

    useEffect(() => {
        async function getBlogPosts() {
          const talentArray = await getTalent();
          console.log(talentArray)
  
          const allItems = talentArray.data.details.data
          console.log(allItems);
  
          const currentIteminArray = allItems.filter(x => x.id === id)
          const currentItem = currentIteminArray[0].relations;
        //   console.log("Current Item", currentIteminArray[0]);
          
          console.log("Current Item", currentIteminArray[0]);
          const {content, author, sequence, socials, oneliner} = currentIteminArray[0];
          
          const currentFinalItem = {
            oneliner: oneliner,
            content: content,
            author: author,
            sequence: sequence,
            website: socials.filter(x => x.type.toLowerCase() === "website")[0]?.value,
            websiteHandle: socials.filter(x => x.type.toLowerCase() === "website")[0]?.handle,
            instagram: socials.filter(x => x.type.toLowerCase() === "instagram")[0]?.value,
            instagramHandle: socials.filter(x => x.type.toLowerCase() === "instagram")[0]?.handle,
            youtube: socials.filter(x => x.type.toLowerCase() === "youtube")[0]?.value,
            youtubeHandle: socials.filter(x => x.type.toLowerCase() === "youtube")[0]?.handle,
          }

          const socialIds = {
              websiteId: socials.filter(x => x.type.toLowerCase() === "website")[0]?.id,
              instagramId: socials.filter(x => x.type.toLowerCase() === "instagram")[0]?.id,
              youtubeId: socials.filter(x => x.type.toLowerCase() === "youtube")[0]?.id,
          }
          setIds(socialIds);
          
          setPlayerDetails(currentFinalItem)
        //   const arrayOfImages = currentItem.images;
          const video = getCorrespondingImage(currentItem, "video")
          const banner = getCorrespondingImage(currentItem, "bannerImage")
          const footer1 = getCorrespondingImage(currentItem, "footer1")
          const footer2 = getCorrespondingImage(currentItem, "footer2")
          const footer3 = getCorrespondingImage(currentItem, "footer3")
          setHoverVideo(video)
          setBannerImage(banner)
          setFooterImg1(footer1)
          setFooterImg2(footer2)
          setFooterImg3(footer3)
        }
        getBlogPosts();
      }, [])

      function getCorrespondingImage(arr, type){
        //   console.log("In Corresponding Image", arr);
          const imageLinkItem = arr.filter(image => image.type === type)
        //   console.log("Image Link Item", imageLinkItem);
          if (imageLinkItem === undefined || imageLinkItem.length === 0) return "";
          else {
              const data = {
                url: imageLinkItem[0].image.key, 
                type: type,
                id: imageLinkItem[0].image.id,
            };
              console.log("Data", data);
            return data;
          }
        //   const imgLink = imageLinkItem[0].key
        //   console.log(type, imgLink);
      }


    const history = useHistory();

    function handleChangeInForm(e) {
        const value = e.target.value;
        const name = e.target.name;
        // console.log(playerDetails);
        setPlayerDetails({
          ...playerDetails, [name]: value
        })
    }

    function handleQuillChange(e){
        const value = e;
        console.log(playerDetails);
        setPlayerDetails((prev) =>{
            return {
                ...prev, content: value
              }
        } )
      }


    async function handleSubmit(e){
        e.preventDefault();

        if(validateForm()){                
            const body = {
                imageData: [
                    hoverVideo, bannerImage, footerImg1, footerImg2, footerImg3
                ],
                oneliner: playerDetails.oneliner,
                content: playerDetails.content,
                author: playerDetails.author,
                socialData: [
                    {
                        type: "website",
                        value: playerDetails.website,
                        id: ids.websiteId,
                        handle: playerDetails.websiteHandle
                    },
                    {
                        type: "instagram",
                        value: playerDetails.instagram,
                        id: ids.instagramId,
                        handle: playerDetails.instagramHandle
                    },
                    {
                        type: "youtube",
                        value: playerDetails.youtube,
                        id: ids.youtubeId,
                        handle: playerDetails.youtubeHandle,
                    },
                ],
                id: id,
                sequence: playerDetails.sequence,
            }
            console.log(body);
            const addResponse = await updateTalent(body)
            console.log(addResponse)
            history.push("/dashboard/talent")
        }

        
    }

    function removeFormData(name) {
        const tempFormData = [...finalImages]
        const filterList = tempFormData.filter(x => x.name !== name)
        console.log("filtered list", filterList);
        setFinalImages(filterList)
    }

    const [showGallery, setShowGallery] = useState(false);

      const [formError, setFormError] = useState({
        oneliner: "",
        banner: "",
        author: "",
        content: "",
        sequence: "",
    })
      
      function validateForm(){
        console.log("In validate Form");
        const errorObject = {
          oneliner: "",
          banner: "",
          author: "",
          content: "",
          sequence: "",
        }
        let error = true;
        if(playerDetails.author === "") {
            console.log("Author Field cannot be empty");
            error = false;
            errorObject.author = "Author Field cannot be empty";
        } else errorObject.author = "";

        if(playerDetails.content === "") {
          console.log("Content Field cannot be empty");
          error = false;
          errorObject.content = "Content Field cannot be empty";
      } else errorObject.content = "";

        if(playerDetails.sequence === "") {
          console.log("Sequence Field cannot be empty");
          error = false;
          errorObject.sequence = "Sequence Field cannot be empty";
        } else errorObject.sequence = "";

        if(playerDetails.oneliner === "") {
          console.log("One Liner Field cannot be empty");
          error = false;
          errorObject.oneliner = "Title Field cannot be empty";
        } else errorObject.oneliner = "";

        setFormError(errorObject)
        return error;
    }

    
    return (
        <div className="main-container">
            {/* {console.log("HoverVideo here: ", hoverVideo)}
            {console.log(finalImages)}
            {console.log(galleryImages)} */}
            {console.log(playerDetails)}
            <br />
            <div className="dashboard__header">
                <h1 className="page__header">Add New Players</h1>
                {/* <h1 className="page__header">Add Items</h1> */}
                <button className="card__button card__button--add" onClick={() => history.goBack()}>Back</button>
            </div>

            {/* Modal Starts */}
                <GalleryImagesModal 
                    selected={selected}
                    showGallery={showGallery}
                    setShowGallery={setShowGallery}
                    hoverVideo={hoverVideo} 
                    setHoverVideo={setHoverVideo}
                    bannerImage={bannerImage}
                    setBannerImage={setBannerImage}
                    footerImg1={footerImg1}
                    setFooterImg1={setFooterImg1}
                    footerImg2={footerImg2}
                    setFooterImg2={setFooterImg2}
                    footerImg3={footerImg3}
                    setFooterImg3={setFooterImg3}
                />
            {/* Modal Ends */}

            {/* Home Page Video */}
            <br />
            <h2>Add Video</h2>
            <div className="banner-img-container banner-img-container--video" onClick={() => {
                    setShowGallery(true)
                    setSelected(".img-preview")
            }}>
                {
                    hoverVideo.url ? (
                        <>
                            {/* <video src={hoverVideo} alt="banner" className="banner__img img-preview" /> */}
                            <video alt="banner" className="banner__img img-preview" 
                                onMouseOver={event => event.target.play()}
                                onMouseOut={event => {
                                    event.target.pause();
                                    event.target.currentTime = 0;
                                }}>
                                <source src={hoverVideo.url}  />
                            </video>
                            <button className="banner-img-container-btn" onClick={() => {
                                removeFormData("video")
                                setHoverVideo("")
                            }}>Delete</button>
                        </>
                    ) : (
                        <div className="add-img-modal">Add Hover Video</div>
                    )
                }
            </div>
            {/* Banner Image */}

            <h2>Add Banner Images</h2>
            <div className="banner-img-container" onClick={() => {
                    setShowGallery(true)
                    setSelected(".banner-img-preview")
            }}>
                {
                    bannerImage.url ? (
                        <>
                            <img src={bannerImage.url} alt="banner" className="banner__img banner-img-preview" />
                            <button className="banner-img-container-btn" onClick={() => {
                                removeFormData("bannerImage")
                                setBannerImage("")
                            }}>Delete</button>
                        </>
                    ) : (
                        <div className="add-img-modal">Add Banner Image</div>
                    )
                }
            </div>

            <form className="edit__form">
                {/* Title */}

                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>One Liner: </h3>
                    </label>
                    <input type="text" name="oneliner" className="edit__input" value={playerDetails.oneliner} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.oneliner && <h3 className="text-danger">{formError.oneliner}</h3>}
                {/* Author */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Author: </h3>
                    </label>
                    <input type="text" name="author" className="edit__input" value={playerDetails.author} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.author && <h3 className="text-danger">{formError.author}</h3>}
                {/* Content */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Content: </h3>
                    </label>
                    {/* <textarea name="content" id="" cols="30" rows="10" className="edit__textarea" value={playerDetails.content} onChange={(e) => handleChangeInForm(e)}></textarea> */}
                    <div className="edit__input">
                        <Editor detailsValue={playerDetails.content} detailsOnChange={handleQuillChange} />
                    </div>
                </div>
                {formError.content && <h3 className="text-danger">{formError.content}</h3>}
                {/* Sequence */}
                <br />
                
                {/* Social Handle - Website */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Website Handle: </h3>
                    </label>
                    <input type="text" name="websiteHandle" className="edit__input" value={playerDetails.websiteHandle} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social - Website */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Website Link: </h3>
                    </label>
                    <input type="text" name="website" className="edit__input" value={playerDetails.website} onChange={(e) => handleChangeInForm(e)}/>
                </div>


                {/* Social Handle - Insta */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Instgram Handle: </h3>
                    </label>
                    <input type="text" name="instagramHandle" className="edit__input" value={playerDetails.instagramHandle} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social - Insta */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Instgram Link: </h3>
                    </label>
                    <input type="text" name="instagram" className="edit__input" value={playerDetails.instagram} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social Handle - Youtube */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>YouTube Handle: </h3>
                    </label>
                    <input type="text" name="youtubeHandle" className="edit__input" value={playerDetails.youtubeHandle} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social - Youtube */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>YouTube Link: </h3>
                    </label>
                    <input type="text" name="youtube" className="edit__input" value={playerDetails.youtube} onChange={(e) => handleChangeInForm(e)}/>
                </div>
            </form>
            <br />
            <br />

            {/* Footer Images */}
            <h1>Add Footer Images</h1>
            <div className="footer__grid">
                <div className="footer__grid__item" onClick={() => {
                    setShowGallery(true)
                    setSelected(".footer-preview1")
            }}>
                {
                    footerImg1.url ? (
                        <div className="footer-img-container">
                            <img src={footerImg1.url} alt="banner" className="banner__img footer-preview1" />
                            <button className="footer-img-container-btn" onClick={() => setFooterImg1("")}>Delete</button>
                        </div>
                    ) : (
                        
                        <div className="add-img-modal">Add Footer Image 1</div>
                    )
                }
           
                </div>
                <div className="footer__grid__item" onClick={() => {
                    setShowGallery(true)
                    setSelected(".footer-preview2")
            }}>
                {
                    footerImg2.url ? (
                        <>
                            <img src={footerImg2.url} alt="banner" className="banner__img footer-preview2" />
                            <button className="footer-img-container-btn" onClick={() => setFooterImg2("")}>Delete</button>
                        </>
                    ) : (
                        <div className="add-img-modal">Add Footer Image 2</div>
                    )
                }
                    {/* <img src={Img2} alt="" className="footer__images" /> */}
                </div>
                <div className="footer__grid__item" onClick={() => {
                    setShowGallery(true)
                    setSelected(".footer-preview3")
            }}>
                {
                    footerImg3.url ? (
                        <>
                            <img src={footerImg3.url} alt="banner" className="banner__img footer-preview3" />
                            <button className="footer-img-container-btn" onClick={() => setFooterImg3("")}>Delete</button>
                        </>
                    ) : (
                        <div className="add-img-modal">Add Footer Image 3</div>
                    )
                }
                </div>
            </div>
            <br />
            <br />
            <div className="page__footer">
                <button className="footer__btn" onClick={(e) => handleSubmit(e)}>Save Changes</button>
            </div>
        </div>
    )
}

export default EditItems
