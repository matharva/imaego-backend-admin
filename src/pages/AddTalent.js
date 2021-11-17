import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom';

// Components
import GalleryImagesModal from '../components/GalleryImagesModal';
import Editor from '../components/Editor';
// API service
import { addTalent, getTalent } from "../services/talentService"

// Styles
import "../styles/EditItems.css"
import "../styles/common.css"

const AddTalent = () => {
    const history = useHistory();

    ////////////////////////////////////////////////////////////////////////////// States

    // Different states are required to set the img in the right place 
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

    // This state will be updated when form is filled and will be sent during POST
    const [talentDetails, setTalentDetails] = useState({
        oneliner: "",  
        author: "",
        content: "",
        sequence: 999, // 999 is just a placeholder value, the sequence number will be no. of players + 1    
        website: "",
        websiteHandle: "",
        instagram: "",
        instagramHandle: "",
        youtube: "",
        youtubeHandle: "",
      })

    //  Used to store where (banner, video, footer) the image from the gallery image modal will be added
    const [selected, setSelected] = useState()

    // To toggle Gallery Iamges Modal
    const [showGallery, setShowGallery] = useState(false);

    const [formError, setFormError] = useState({
        oneliner: "",
        banner: "",
        author: "",
        content: "",
        sequence: "",
    })

    ////////////////////////////////////////////////////////////////////////////// Event Handlers

    function handleChangeInForm(e) {
        const value = e.target.value;
        const name = e.target.name;
        setTalentDetails({
          ...talentDetails, [name]: value
        })
      }

      function handleQuillChange(e){
        const value = e;
        setTalentDetails({
            ...talentDetails, content: value
          })
      }

    async function handleSubmit(e){
        e.preventDefault();
        // let addBlogsReturnObject, id;
        // async function addImageToBlog(data){
        //     console.log(data);
        //     await addImage(data);
        // }
        if(validateForm()){                
            const players = await getTalent();
            const playerArray = players.data.details.data;
            console.log("players from add talent", players)
            const currentSequence = playerArray.length + 1;
            let imgDataArray = [
                hoverVideo, bannerImage, footerImg1, footerImg2, footerImg3
            ].filter((x) => x.id !== "")
            console.log(imgDataArray)
            const body = {
                imageData: imgDataArray,
                oneliner: talentDetails.oneliner,
                content: talentDetails.content,
                author: talentDetails.author,
                socialData: [
                    {
                        type: "website",
                        value: talentDetails.website,
                        handle: talentDetails.websiteHandle,
                    },
                    {
                        type: "instagram",
                        value: talentDetails.instagram,
                        handle: talentDetails.instagramHandle,
                    },
                    {
                        type: "youtube",
                        value: talentDetails.youtube,
                        handle: talentDetails.youtubeHandle,
                    },
                ],
                sequence: currentSequence
            }
            console.log(body);
            const addResponse = await addTalent(body)
            console.log(addResponse)
            history.push("/dashboard/talent")
        }        
    }

    function handleChange(image, type){
        let data = new FormData();
        data.append('images', image[0], image[0].name);
        // data.append('id', id);
        data.append("type", type);
        data.append("sequence", 0);

        const imgFormData = {
            name: type,
            data: data,
        }

        setFinalImages([
            ...finalImages, imgFormData
        ])
    }

    // Handles delete when delete and setting different image 
    // deletes the previously selected image from the finalImages state 
    function removeFormData(name) {
        const tempFormData = [...finalImages]
        const filterList = tempFormData.filter(x => x.name !== name)
        console.log("filtered list", filterList);
        setFinalImages(filterList)
    }
 
    // Validates form and adds error to the required fields
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
        if(talentDetails.author === "") {
            console.log("Author Field cannot be empty");
            error = false;
            errorObject.author = "Author Field cannot be empty";
        } else errorObject.author = "";

        if(talentDetails.banner === ""){
          console.log("Banner Field cannot be empty");
          error = false;
          errorObject.banner = "Banner Field cannot be empty";
        } else errorObject.banner = "";

        if(talentDetails.content === "") {
          console.log("Content Field cannot be empty");
          error = false;
          errorObject.content = "Content Field cannot be empty";
      } else errorObject.content = "";

        if(talentDetails.sequence === "") {
          console.log("Sequence Field cannot be empty");
          error = false;
          errorObject.sequence = "Sequence Field cannot be empty";
        } else errorObject.sequence = "";

        if(talentDetails.oneliner === "") {
          console.log("One Liner Field cannot be empty");
          error = false;
          errorObject.oneliner = "One Liner Field cannot be empty";
        } else errorObject.oneliner = "";

        setFormError(errorObject)
        return error;
    }


    
    return (
        <div className="main-container">
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
            <br />
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
                    <input type="text" name="oneliner" className="edit__input" value={talentDetails.oneliner} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.oneliner && <h3 className="text-danger">{formError.oneliner}</h3>}
                {/* Author */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Author: </h3>
                    </label>
                    <input type="text" name="author" className="edit__input" value={talentDetails.author} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.author && <h3 className="text-danger">{formError.author}</h3>}
                {/* Content */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Content: </h3>
                    </label>
                    {/* <textarea name="content" id="" cols="30" rows="10" className="edit__textarea" value={talentDetails.content} onChange={(e) => handleChangeInForm(e)}></textarea> */}
                    <div className="edit__input">
                        <Editor detailsValue={talentDetails.content} detailsOnChange={handleQuillChange} />
                    </div>
                    {/* <ReactQuill placeholder="write something..." /> */}
                </div>
                {formError.content && <h3 className="text-danger">{formError.content}</h3>}
                

                {/* Social Handle - Website */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Website Handle: </h3>
                    </label>
                    <input type="text" name="websiteHandle" className="edit__input" value={talentDetails.websiteHandle} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social - Website */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Website: </h3>
                    </label>
                    <input type="text" name="website" className="edit__input" value={talentDetails.website} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social Handle - Insta */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Instgram Handle: </h3>
                    </label>
                    <input type="text" name="instagramHandle" className="edit__input" value={talentDetails.instagramHandle} onChange={handleChangeInForm}/>
                </div>

                {/* Social - Insta */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Instgram: </h3>
                    </label>
                    <input type="text" name="instagram" className="edit__input" value={talentDetails.instagram} onChange={handleChangeInForm}/>
                </div>

                {/* Social Handle- Youtube */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>YouTube Handle: </h3>
                    </label>
                    <input type="text" name="youtubeHandle" className="edit__input" value={talentDetails.youtubeHandle} onChange={(e) => handleChangeInForm(e)}/>
                </div>

                {/* Social - Youtube */}
                <br />
                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>YouTube: </h3>
                    </label>
                    <input type="text" name="youtube" className="edit__input" value={talentDetails.youtube} onChange={(e) => handleChangeInForm(e)}/>
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
                <button className="footer__btn" onClick={(e) => handleSubmit(e)}>Create New Player</button>
            </div>
        </div>
    )
}

export default AddTalent
