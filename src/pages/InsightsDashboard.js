import React, { useState, useEffect } from 'react'
import "../styles/Dashboard.css"
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

// import { getBlogs, deleteBlogs } from '../services/talentService';
import { getInsights, deleteInsights } from '../services/insightsService';

const Dashboard = () => {

    const [playerDetails, setPlayerDetails] = useState([]);  

    useEffect(() => {
        async function getBlogPosts() {
          const blogs = await getInsights();
          console.log(blogs)
          setPlayerDetails(blogs.data.details.data)
        }
        getBlogPosts();
        }, [])

    async function handleDelete(id) {

        let resp = await deleteInsights(id);
        console.log("Delete ho gaya", resp)
        const blogs = await getInsights();

        setPlayerDetails(blogs.data.details.data)
    }

    return (
        <div className="dashboard">
            {console.log(playerDetails)}
            <div className="dashboard__header">
                <h1 className="page__header">Insights Dashboard</h1>
                <div className="button__section">
                    <Link to="/dashboard/insight_sequence">
                            <button className="card__button card__button--add">Change Sequence</button>
                        </Link>
                    <Link to="/addInsights">
                        <button className="card__button card__button--add">Add Items</button>
                    </Link>
                </div>
            </div>

            <div className="dashboard__grid">
                {/* Cards Starts */}
                {
                    playerDetails.map((player) => {
                        return (
                            <>
                                <div className="grid__card">
                                    <div className="card__img__container">
                                        {/* <img src={player.images[0]?.key} alt="" className="card__img" /> */}
                                        <img src={player.relations[0]?.image.key} alt="" className="card__img" />
                                    </div>
                                    <div className="card__title">{player.title}</div>
                                    <div className="card__author">{player.author}</div>
                                    <div className="card__desc" dangerouslySetInnerHTML={{ __html: player.content }} />
                                    <div className="card__button__container">
                                        <Link to={`/editInsight/${player.id}`}>
                                            <button className="card__button card__button--edit"><EditIcon /></button>
                                        </Link>
                                        <button className="card__button card__button--delete" style={{marginLeft: "1rem"}} onClick={() => handleDelete(player.id)}><DeleteIcon /></button>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
               
            </div>

        </div>
    )
}

export default Dashboard
