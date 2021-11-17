import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

// API service
import { getInsights, changeSequence } from '../services/insightsService';

// Styles
import "../styles/common.css"

// External Imports
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ChangeInsightSequence = () => {
    const history = useHistory();

    // State
    const [blogDetails, setBlogDetails] = useState([]);
    const [sequence, setSequence] = useState([])

    // UseEffects
    useEffect(() => {
        async function getBlogPosts() {
            const blogs = await getInsights();
            console.log(blogs)
            const talentData = blogs.data.details.data
            console.log("talentData", talentData);
            setBlogDetails(talentData)

            const seqArray = []
            talentData.forEach(element => {
                seqArray.push({
                    id: element.id,
                    sequence: element.sequence
                })
            });
            setSequence(seqArray)
            }
        getBlogPosts();
    }, [])

    function onDragEnd(result) {
        // This function will reorder the list
        console.log(result);
        // console.log(sequence);
        if (!result.destination) return;

        // const items = [...playerDetails];
        const seq = [...sequence]
        console.log("Copy of Seq: ", seq);
        // console.log(items);
        // const [reorderedItem] = items.splice(result.source.index, 1);

        const [reorderedItemArray] = seq.splice(result.source.index, 1);
        console.log("Reordered Item Array", reorderedItemArray);
        // items.splice(result.destination.index, 0, reorderedItem);
        seq.splice(result.destination.index, 0, reorderedItemArray);
        console.log("Final Updated Sequence", seq);
        
        setSequence(seq)
        // setPlayerDetails(items);
    }

    async function handleSubmit(e){
        e.preventDefault();
        console.log("Old Sequence", sequence);
        const newSequence = []
        sequence.forEach((item, index) => {
            newSequence.push({
                ...item, sequence: index + 1,
            })
        })
        console.log("New Sequence", newSequence);
        // console.log("Data being sent to POST", sequence);
        const respData = await changeSequence(newSequence);
        console.log(respData);

        history.push("/dashboard/insights")
    }

    
    return (
        <div>
            <div className="dashboard">
            <div className="dashboard__header">
                <h1 className="page__header">Talent Dashboard</h1>
                <div className="button__section">
                    
                        <button className="card__button card__button--add" onClick={(e) => handleSubmit(e)}>Save Changes</button>
                    
                    
                        <button className="card__button card__button--add" onClick={() => history.goBack()}>Back</button>
                    
                </div>
            </div>
            {console.log("Player Details from 78", blogDetails)}
            {console.log("Sequence", sequence)}
             <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="vertical">
                        {(provided, snapshot) => (
                            <div className={`grid__droppable ${snapshot.isDraggingOver ? "drag--background--drop" : ""}`} ref={provided.innerRef} {...provided.droppableProps}>
                            {/* <div className="droppable" > */}
                                
                                <div className="">

                                {sequence.map((player, index) => {
                                    const currentPlayer = blogDetails.filter(item => player.sequence === item.sequence)[0]
                                    console.log("CurrentPlayer", currentPlayer);
                                    return (
                                        <Draggable draggableId={currentPlayer.id} index={index} key={currentPlayer.id}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <>
                                                <div className={`grid__card__seq ${snapshot.isDragging ? "drag--background" : ""}`} 
                                                ref={provided.innerRef} 
                                                {...provided.draggableProps} 
                                                {...provided.dragHandleProps}
                                                >
                                                    <div className="card__title">{currentPlayer.title}</div>
                                                    <div className="card__author">{currentPlayer.author}</div>
                                                    <div className="card__desc" dangerouslySetInnerHTML={{ __html: currentPlayer.content }} />
                                                </div>
                                                    {provided.placeholder}

                                                </>
                                                )
                                            }}
                                        </Draggable>
                                    )
                                })
                            }
                                </div>
                                {provided.placeholder}
                            </div>
                            )
                        }
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}

export default ChangeInsightSequence
