import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api";
import { displayDate, displayTime} from "../utils/date-time";

function ReservationDisplay(reservation) {
    const history = useHistory();

    //format singular/plural
    let people = "people";
    if(reservation.people === 1){ people = "person"}
    
    //seat button
    function SeatButton() {
        if(reservation.status !== "booked") return null;

        const reservation_id = reservation.reservation_id;
        return <Link to={`/reservations/${reservation_id}/seat`} className="btn btn-success">Seat</Link>
    }

    //edit button
    function EditButton() {
        if(reservation.status !== "booked") return null;

        const reservation_id = reservation.reservation_id;
        return <Link to={`/reservations/${reservation_id}/edit`} className="btn btn-secondary">Edit</Link>
    }

    //handle cancel button click
    async function handleCancel(event) {
        event.preventDefault();

        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
            try {
                const data = {status: "cancelled"};
                await updateStatus(data, reservation.reservation_id);
                history.go(0);
            } catch(error) {
                console.log(error);
            }
        }
    }

    //render cancel button only if the status is "booked"
    function CancelButton() {
        if(reservation.status !== "booked") return null;

        return <button onClick={(event) => handleCancel(event)} data-reservation-id-cancel={reservation.reservation_id} className="btn btn-danger">Cancel</button>
    }
    
    //format phone number
    const number = reservation.mobile_number.toString().split('-').join('');
    let phoneNumber;
    if(number.length === 10){
        const num1 = number.substring(0, 3);
        const num2 = number.substring(3, 6);
        const num3 = number.substring(6, 10);
        phoneNumber = `${num1}-${num2}-${num3}`;
    } else {
        const num1 = number.substring(0, 3);
        const num2 = number.substring(3, 7);
        phoneNumber = `${num1}-${num2}`;
    }
    
    //render reservation card
    return <div key={reservation.reservation_id} className="card col-md-auto bg-light">
        <div className="card-body">
            <h5 className="card-title">Reservation for {reservation.first_name} {reservation.last_name}</h5>
            <p className="card-text"><small className="text-muted">For {reservation.people} {people}</small></p>
            <p className="card-text">Phone Number: {phoneNumber}</p>
            <p className="card-text">Date: {displayDate(reservation.reservation_date)}</p>
            <p className="card-text">Time: {displayTime(reservation.reservation_time)}</p>
            <p className="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
            <CancelButton />
            <EditButton />
            <SeatButton />
        </div>
    </div>
}

//Function for generating react list of reservations
function ReservationList({ date, phoneQuery, reservations }) {
    //check for no data
    if(reservations.length < 1){ return <h4>No reservations found.</h4> }

    //generate reservation displays
    const list = reservations.map(ReservationDisplay);

    //check for type of list
    let listType = displayDate(date);
    if(phoneQuery) {
        listType = phoneQuery;
    }
    
    //render reservations with appropriate title
    return <div>
        <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {listType}</h4>
        </div>
        <div className="row">
            {list}
        </div>
        
    </div>;
}

export default ReservationList;