import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

// API service
import { getInsights, addInsights } from '../services/insightsService'; 

// Styles
import "../styles/EditItems.css"
import "../styles/common.css"

// Components
import Editor from '../components/Editor';
import GalleryImagesModal from '../components/GalleryImagesModal';


const AddInsights = () => {
    // const [hoverVideo, setHoverVideo] = useState("");
    const [bannerImage, setBannerImage] = useState({
        url: "",
        id: "",
        type: "",
    });

    const [finalImages, setFinalImages] = useState([])
    const [talentDetails, setTalentDetails] = useState({
        title: "",
        // oneliner: "",
        author: "",
        content: "",
        sequence: "",
      })
      const [formError, setFormError] = useState({
        title: "",
        banner: "",
        author: "",
        content: "",
    })

      const [selected, setSelected] = useState()


    const history = useHistory();

    function handleChangeInForm(e) {
        const value = e.target.value;
        const name = e.target.name;
        setTalentDetails({
          ...talentDetails, [name]: value
        })
      }

    async function handleSubmit(e){
        e.preventDefault();
        if(validateForm()){
    
            async function addBlogsToServer(){
                const blogs = await getInsights();
                const currentBlogs = blogs.data.details.data;
                console.log(currentBlogs);
                const blogSequence = currentBlogs.length + 1;
                console.log(blogSequence)
                const body = {
                    imageData: [
                        bannerImage
                    ],
                    title: talentDetails.title,
                    // oneliner: talentDetails.oneliner,
                    content: talentDetails.content,
                    author: talentDetails.author,
                    sequence: blogSequence,
                }
                console.log(body);
                const addResponse = await addInsights(body)
                console.log(addResponse)
                    history.push("/dashboard/insights")
            }
            addBlogsToServer() 
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

    function removeFormData(name) {
        const tempFormData = [...finalImages]
        const filterList = tempFormData.filter(x => x.name !== name)
        console.log("filtered list", filterList);
        setFinalImages(filterList)
    }

    const [showGallery, setShowGallery] = useState(false);

    function validateForm(){
        console.log("In validate Form");
        const errorObject = {
          title: "",
          banner: "",
          author: "",
          content: "",
        }
        let error = true;
        if(talentDetails.author === "") {
            console.log("Author Field cannot be empty");
            error = false;
            errorObject.author = "Author Field cannot be empty";
        } else errorObject.author = "";

        if(talentDetails.content === "") {
          console.log("Content Field cannot be empty");
          error = false;
          errorObject.content = "Content Field cannot be empty";
      } else errorObject.content = "";

        if(talentDetails.title === "") {
          console.log("Title Field cannot be empty");
          error = false;
          errorObject.title = "Title Field cannot be empty";
        } else errorObject.title = "";

        setFormError(errorObject)
        return error;
    }

    function handleQuillChange(e){
        const value = e;
        setTalentDetails({
            ...talentDetails, content: value
          })
      }
      
    
    return (
        <div className="main-container">
            {console.log("Talent", talentDetails)}
            <br />
            <div className="dashboard__header">
                <h1 className="page__header">Add New Insights</h1>
                <button className="card__button card__button--add" onClick={() => history.goBack()}>Back</button>
            </div>

            {/* Modal Starts */}
            <GalleryImagesModal 
                selected={selected}
                showGallery={showGallery}
                setShowGallery={setShowGallery}
                bannerImage={bannerImage}
                setBannerImage={setBannerImage}
                />
            
            
            {/* Banner Image */}
            <br />
            <h1>Add Banner Image</h1>
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

            <h1>Add Details</h1>
            <form className="edit__form">
                {/* Title */}

                <div className="input-control">
                    <label htmlFor="title" className="edit__label">
                        <h3>Title: </h3>
                    </label>
                    <input type="text" name="title" className="edit__input" value={talentDetails.title} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.title && <h3 className="text-danger">{formError.title}</h3>}
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
                </div>
                {formError.content && <h3 className="text-danger">{formError.content}</h3>}
                
            </form>
            <br />
            <br />

           
            <div className="page__footer">
                <button className="footer__btn" onClick={(e) => handleSubmit(e)}>Create New Player</button>
            </div>
        </div>
    )
}

export default AddInsights
