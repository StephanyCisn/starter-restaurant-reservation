import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { searchReservations } from "../utils/api";
import ReservationList from "./ReservationDisplay";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservations() {
    //declare reservations, phoneNumber, and error states
    const [reservations, setReservations] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorState, setErrorState] = useState(null);

    //get query and load reservations that match it
    const query = useQuery();
    const phoneQuery = query.get("mobile_number");

    useEffect(loadReservations, [phoneQuery]);

    function loadReservations() {
        const abortController = new AbortController();
        setErrorState(null);
        if(!phoneQuery){
            return;
        }
        try{
            searchReservations({ phoneQuery }, abortController.signal)
                .then(setReservations)
        } catch(error) {
            setErrorState(error);
        }
        return () => abortController.abort();
    }

    //handle changes in form input
    const changeHandler = event => {
        setPhoneNumber(event.target.value );
    }

    //handle cancel button
    const history = useHistory();
    function handleCancel(event) {
        event.preventDefault();
        history.goBack();
    }

    //handle submit button
    function handleSubmit(event){
        event.preventDefault();         
        history.push(`/search?mobile_number=${phoneNumber}`)
    }

    //render search form and any found reservations
    return <div>
    <ErrorAlert error={errorState} />
    <h2>Search for Reservations</h2>
    <form onSubmit={(event) => handleSubmit(event)}>
        <div className="form-group">
            <label htmlFor="mobile_number">Phone Number
                <input
                required
                className="form-control"
                size="30"
                id="mobile_number"
                name="mobile_number" 
                type="text" 
                placeholder="Enter a customer's phone number"
                value={phoneNumber}
                onChange={changeHandler}
                />
            </label>
        </div>
        <button onClick={(event) => handleCancel(event)} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Find</button>
    </form>
    <ReservationList phoneQuery={phoneQuery} reservations={reservations} />
    </div>
}

export default SearchReservations;