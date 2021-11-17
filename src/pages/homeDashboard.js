import React, { useState, useEffect } from 'react'
import "../styles/Dashboard.css"
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

// import { getBlogs, deleteBlogs } from '../services/talentService';
import { getInsights, deleteInsights } from '../services/insightsService';
import GalleryImagesModal from '../components/GalleryImagesModal';
import { addVideo, deleteVideo, getHomeVideos, setActiveVideo } from '../services/homeService';

const Dashboard = () => {

    const [hoverVideo, setHoverVideo] = useState({
        url: "",
        id: "",
        type: "",
    });
    //  Used to store where (banner, video, footer) the image from the gallery image modal will be added
    const [selected, setSelected] = useState()
    const [homePageData,setHomePageData] = useState([]); 

    // To toggle Gallery Iamges Modal
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        async function getHomeData() {
          const data = await getHomeVideos();
        //   console.log(data)
          setHomePageData(data.data.details.data)
        }
        getHomeData();
        }, [])

        useEffect(()=>{
            if(hoverVideo.id){
                // alert(hoverVideo.id);
                addNewVideo(hoverVideo.id);
            }
            // console.log(hoverVideo);
        },[hoverVideo])

    async function handleDelete(e,id) {
        e.stopPropagation()
        // console.log("dhjkdhajsdhjk")
        let resp = await deleteVideo(id);
        // console.log("Delete ho gaya", resp)
        if(resp && !resp.error){
            window.location.reload()
        }
    }

    async function addNewVideo(id){
        let resp = await addVideo(id);
        // console.log(resp);
        if(resp && !resp.error){
            window.location.reload()
        }
    }

    async function setActive(id){
        // console.log("hdjhajsh")
        let resp = await setActiveVideo(id);
        // console.log(resp);
        if(resp && !resp.error){
            window.location.reload()
        }
    }

    return (
        <div className="dashboard">
            {/* {console.log(playerDetails)} */}
            <div className="dashboard__header">
                <h1 className="page__header">HomePage Dashboard</h1>
                <div className="button__section">
                        <button className="card__button card__button--add" onClick={() => {
                    setShowGallery(true)
                    setSelected(".img-preview")
            }}>Add Items</button>
                </div>
            </div>
            {/* Modal Starts */}
            <GalleryImagesModal 
                selected={selected}
                showGallery={showGallery}
                setShowGallery={setShowGallery}
                hoverVideo={hoverVideo} 
                setHoverVideo={setHoverVideo}
                />
            {/* Modal Ends */}

            <div className="dashboard__grid">
                {/* Cards Starts */}
                {
                    homePageData.map((e)=>{
                        return (
                            <div onClick={()=>setActive(e.id)} className={`grid__card ${e.active?"actived":""}`} key={e.id}>
                            <div className="card__img__container">
                                <video 
                                    onMouseOver={event => event.target.play()}
                                    onMouseOut={event => {
                                        event.target.pause();
                                        event.target.currentTime = 0;
                                    }}>
                                    <source src={e?.image.key}/>
                                </video>
                            </div>
                            <div className="card__button__container">
                                <button className="card__button card__button--delete" onClick={(i) => handleDelete(i,e.id)}><DeleteIcon /></button>
                            </div>
                        </div>
                        )
                    })
                }
                {
                    // playerDetails.map((player) => {
                    //     return (
                    //         <>
                    //             <div className="grid__card">
                    //                 <div className="card__img__container">
                    //                     {/* <img src={player.images[0]?.key} alt="" className="card__img" /> */}
                    //                     <img src={player.relations[0]?.image.key} alt="" className="card__img" />
                    //                 </div>
                    //                 <div className="card__title">{player.title}</div>
                    //                 <div className="card__author">{player.author}</div>
                    //                 <div className="card__desc" dangerouslySetInnerHTML={{ __html: player.content }} />
                    //                 <div className="card__button__container">
                    //                     <Link to={`/editInsight/${player.id}`}>
                    //                         <button className="card__button card__button--edit"><EditIcon /></button>
                    //                     </Link>
                    //                     <button className="card__button card__button--delete" style={{marginLeft: "1rem"}} onClick={() => handleDelete(player.id)}><DeleteIcon /></button>
                    //                 </div>
                    //             </div>
                    //         </>
                    //     )
                    // })
                }
               
            </div>

        </div>
    )
}

export default Dashboard
