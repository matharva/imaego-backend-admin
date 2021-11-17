import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// API service
import { getInsights, updateInsights } from '../services/insightsService'

// Styles
import "../styles/EditItems.css"

// Components
import GalleryImagesModal from '../components/GalleryImagesModal'
import Editor from '../components/Editor'

const EditInsights = () => {
    const [bannerImage, setBannerImage] = useState({
        url: "",
        id: "",
        type: "",
    });
    
    const [finalImages, setFinalImages] = useState([])
    const [playerDetails, setPlayerDetails] = useState({
        title: "",  
        author: "",
        content: "",
        sequence: "",
      })

      const [selected, setSelected] = useState()

    const { id } = useParams();

    useEffect(() => {
        async function getBlogPosts() {
          const talentArray = await getInsights();
          console.log("Dard talent array", talentArray)
  
          const allItems = talentArray.data.details.data
          console.log(allItems);
  
          const currentIteminArray = allItems.filter(x => x.id === id)
          const currentItem = currentIteminArray[0];
          console.log("Current Item", currentIteminArray[0]);
          
          console.log(currentIteminArray[0]);
          const {title, content, author, sequence} = currentIteminArray[0];
          
          const currentFinalItem = {
            title: title,
            content: content,
            author: author,
            sequence: sequence,
          }

          
          setPlayerDetails(currentFinalItem)
        //   const arrayOfImages = currentItem.images;
          const banner = getCorrespondingImage(currentItem.relations, "bannerImage")
          console.log("Banner", banner);
          setBannerImage(banner)
        }
        getBlogPosts();
      }, [])

      function getCorrespondingImage(arr, type){
          console.log("In Corresponding Image", arr);
          const imageLinkItem = arr.filter(image => image.type === type)
          console.log(imageLinkItem);
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
      }


    const history = useHistory();

    function handleChangeInForm(e) {
        const value = e.target.value;
        const name = e.target.name;
        setPlayerDetails({
          ...playerDetails, [name]: value
        })
    }


    async function handleSubmit(e){
        e.preventDefault();

        if(validateForm()){                
            const body = {
                imageData: [
                    bannerImage
                ],
                title: playerDetails.title,
                content: playerDetails.content,
                author: playerDetails.author,
                
                id: id,
                sequence: playerDetails.sequence,
            }
            console.log(body);
            const addResponse = await updateInsights(body)
            console.log(addResponse)
            history.push("/dashboard/insights")
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
        title: "",
        banner: "",
        author: "",
        content: "",
        sequence: "",
    })
      
      function validateForm(){
        console.log("In validate Form");
        const errorObject = {
          title: "",
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

        if(playerDetails.title === "") {
          console.log("Title Field cannot be empty");
          error = false;
          errorObject.title = "Title Field cannot be empty";
        } else errorObject.title = "";

        setFormError(errorObject)
        return error;
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

    
    return (
        <div className="main-container">
            {/* {console.log("HoverVideo here: ", hoverVideo)}
            {console.log(finalImages)}
            {console.log(galleryImages)} */}
            {console.log("PlayerDetails", playerDetails)}
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
                bannerImage={bannerImage}
                setBannerImage={setBannerImage}
            />
            {/* Modal Ends */}

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
                        <h3>Title: </h3>
                    </label>
                    <input type="text" name="title" className="edit__input" value={playerDetails.title} onChange={(e) => handleChangeInForm(e)}/>
                </div>
                {formError.title && <h3 className="text-danger">{formError.title}</h3>}
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
                
            </form>
            <br />
            <br />

            <div className="page__footer">
                <button className="footer__btn" onClick={(e) => handleSubmit(e)}>Save Changes</button>
            </div>
            
        </div>
    )
}

export default EditInsights
