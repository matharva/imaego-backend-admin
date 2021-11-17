import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

// API service
import { getTalent, deleteTalent } from '../services/talentService';

// Styles
import "../styles/Dashboard.css"

// Icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const Dashboard = () => {

    const [playerDetails, setPlayerDetails] = useState([]);  

    useEffect(() => {
        async function getBlogPosts() {
          const blogs = await getTalent();
          console.log(blogs)
          const talentData = blogs.data.details.data

          setPlayerDetails(blogs.data.details.data)
        }
        getBlogPosts();
        }, [])

    async function handleDelete(id) {
        let resp = await deleteTalent(id);
        console.log("Delete ho gaya", resp)
        const blogs = await getTalent();

        setPlayerDetails(blogs.data.details.data)
    }

    return (
        <div className="dashboard">
            {console.log("Player", playerDetails)}
            <div className="dashboard__header">
                <h1 className="page__header">Talent Dashboard</h1>
                <div className="button__section">
                    <Link to="/dashboard/talent_sequence">
                        <button className="card__button card__button--add">Change Sequence</button>
                    </Link>
                    <Link to="/addTalent">
                        <button className="card__button card__button--add">Add Items</button>
                    </Link>
                </div>
            </div>

                
            <div className="dashboard__grid">
                {playerDetails.map((player) => {
                    return (
                        <div className="grid__card" key={player.id}>
                            <div className="card__img__container">
                                <video 
                                    onMouseOver={event => event.target.play()}
                                    onMouseOut={event => {
                                        event.target.pause();
                                        event.target.currentTime = 0;
                                    }}>
                                    <source src={player.relations.filter(x => x.type === "video")[0]?.image.key}/>
                                </video>
                                {/* <img src={player.relations.filter(x => x.image.type === "video")[0].image.key} alt="" className="card__img" /> */}
                            </div>

                            {/* <div className="card__title">{player.title}</div> */}
                            <div className="card__author">{player.author}</div>
                            <div className="card__desc" dangerouslySetInnerHTML={{ __html: player.content }} />
                            <div className="card__button__container">
                                <Link to={`/editTalent/${player.id}`}>
                                    <button className="card__button card__button--edit"><EditIcon /></button>
                                </Link>
                                <button className="card__button card__button--delete" style={{marginLeft: "1rem"}} onClick={() => handleDelete(player.id)}><DeleteIcon /></button>
                            </div>
                        </div>
                        )
                    })
                }
            </div>            
        </div>
        )
}

export default Dashboard
