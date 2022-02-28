import React, {useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom";
import { createReservation, readReservation, updateReservation } from "../utils/api.js";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation({ date }) {
    //declare reservation state
    let [errorState, setErrorState] = useState(null);
    let [reservation, setReservation] = useState({ 
        "first_name": "", 
        "last_name": "", 
        "mobile_number": "",
        "reservation_date": "",
        "reservation_time": "",
        "people": ""
    });
    
   

    //render reservation form
    return <div>
        <ErrorAlert error={errorState} />
        <h2>Reservation Form</h2>
        <form onSubmit={(event) => handleSubmit(reservation, event)}>
            <div className="form-group">
                <label htmlFor="first_name">First Name
                    <input
                    required
                    className="form-control" 
                    id="first_name"
                    name="first_name" 
                    type="text" 
                    placeholder="First Name"
                    value={reservation.first_name}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last Name
                    <input
                    required
                    className="form-control" 
                    id="last_name"
                    name="last_name" 
                    type="text" 
                    placeholder="Last Name"
                    value={reservation.last_name}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="mobile_number">Mobile Number
                    <input
                    required
                    className="form-control" 
                    id="mobile_number"
                    name="mobile_number" 
                    type="tel" 
                    placeholder="1234567890" 
                    value={reservation.mobile_number}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="reservation_date">Date
                    <input
                    required
                    className="form-control" 
                    id="reservation_date"
                    name="reservation_date" 
                    type="date"
                    value={reservation.reservation_date}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="reservation_time">Time
                    <input
                    required
                    className="form-control" 
                    id="reservation_time"
                    name="reservation_time" 
                    type="time"
                    value={reservation.reservation_time}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="people">People
                    <input
                    required
                    className="form-control" 
                    id="people"
                    name="people" 
                    type="number" 
                    min="1"
                    value={reservation.people}
                    onChange={changeHandler}
                    />
                </label>
            </div>
            <button onClick={(event) => handleCancel(event)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default NewReservation;