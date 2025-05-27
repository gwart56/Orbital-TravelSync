import './ActivityContainer.css';
import { MdDeleteForever } from "react-icons/md";
import { useState } from 'react';

export default function ActivityContainer({activity, handleSave, handleDelete, isEdit}) {
    const {id, name, time, locName, locAddress} = activity;

    const [isEditing, setIsEditing] = useState(isEdit);

    function saveActivity(formData) {
    // event.preventDefault();
    // const formEl = event.currentTarget;
    // const formData = new FormData(formEl);
        const valuesArray = Array.from(formData.values());
        setIsEditing(false);
        handleSave(id, valuesArray);
    }

    return !isEditing ? (//display mode
        <div className={`activity-container js-activity-container-${id}`}>
            <div className ="activity-name activity-info">
                <strong>Activity: </strong>
                <span className="val">{name}</span>
            </div>
            <div className="activity-time activity-info">
                <strong>Time: </strong><span className="val">{time}</span>
            </div>
            <div className ="location-name activity-info">
                <strong>Location: </strong><span className="val">{locName}</span>
            </div>
            <div className ="location-address activity-info">
                <strong>Address: </strong><span className="val">{locAddress}</span>
            </div>
            <div className="activity-butt-div">
                <button className="activity-edit-butt js-activity-butt" data-activity-id={id} onClick={() => {setIsEditing(true);console.log("editing mode...");}}>Edit</button>
                <button className="delete-act-butt btn btn-danger" onClick={() => {handleDelete(id)}}><MdDeleteForever /></button>
            </div>
        </div>
    )
    :(//editing mode
        <div className={`activity-container js-activity-container-${id}`}>
            <form action={saveActivity}>
                <div className ="activity-name activity-info">
                    <strong>Activity: </strong>
                    <span className="val">
                        <input className="activity-input" type="text" placeholder="eg shopping(normal ting)" name="name" defaultValue={name}/>
                    </span>
                </div>
                <div className="activity-time activity-info">
                    <strong>Time: </strong>
                    <span className="val">
                        <input className="activity-input" type="time" placeholder="eg 1200" name="time" defaultValue={time}/>
                    </span>
                </div>
                <div className ="location-name activity-info">
                    <strong>Location: </strong>
                    <span className="val">
                        <input className="activity-input" type="text" placeholder="eg mcdonalds" name="locName" defaultValue={locName}/>
                    </span>
                </div>
                <div className ="location-address activity-info">
                    <strong>Address: </strong>
                    <span className="val">
                        <input className="activity-input" type="text" placeholder="eg 123 normal rd" name="locAddress" defaultValue={locAddress}/>
                    </span>
                </div>
                <div className="activity-butt-div">
                    <button className="activity-edit-butt js-activity-butt" data-activity-id={id}>Save</button>
                </div>
            </form>
        </div>
    );
}