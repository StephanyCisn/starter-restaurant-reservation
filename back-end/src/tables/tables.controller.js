const service = require("./tables.service");
const resService = require("../reservations/reservations.service");

//Checks data to confirm it has valid table properties
function hasValidProperties(req, res, next) {
    //get data regardless of api style
    if(req.body.data){ req.body = req.body.data; }
    const data = req.body;

    //return error if no data
    if(!data) { 
        return next({ status: 400, message: `Requires request body, including table_name and capacity.` });
    }

    //return error if table name is too short
    if(!data.table_name || data.table_name.length < 2) {
        return next({ status: 400, message: `Requires table_name to be at least 2 characters.` });
    }
    
    //return error if capacity is not a number or less than 1
    if(!data.capacity || !Number.isInteger(data.capacity) || data.capacity < 1) {
        return next({ status: 400, message: `Requires capacity to be at least 1.` });
    }

    return next();
}

//Confirm that a reservation id is valid, saves knex SQL read of that reservation to locals if it does
async function validReservation(req, res, next) {
    //get data regardless of api style
    if(req.body.data){ req.body = req.body.data; }
    const data = req.body;

    //return error if there's no reservation id
    if(!data || !data.reservation_id) {
        return next({ status: 400, message: `Requires reservation_id.` });
    }

    //get reservation
    const reservation = await service.readRes(data.reservation_id);

    //return error if reservation doesn't exist
    if(!reservation) {
        return next({ status: 404, message: `Reservation ${data.reservation_id} not found.` });
    }

    //confirm reservation isn't seated
    if(reservation.status !== "booked") {
        return next({ status: 400, message: `Reservation ${data.reservation_id} has already been seated.` })
    }    
    
    res.locals.reservation = reservation;
    return next();
}

//Returns an error if the table is full or too small for the reservation
async function validTable(req, res, next) {
    //get variables
    const reservation = res.locals.reservation;
    const tableId = req.params.table_id;
    const table = await service.read(tableId);
    
    //return error if table capacity is smaller than reservation size
    if(table.capacity < reservation.people){
        return next({ status: 400, message: `Table has insufficient capacity.` })
    }

    //return error if table is occupied
    if(table.reservation_id){
        return next({ status: 400, message: `Table is already occupied.` })
    }

    return next();
}

//Confirms a table exists and saves it to locals, or returns an error if no table
async function seatingOccupied(req, res, next) {
    //get table
    const tableId = req.params.table_id
    const table = await service.read(tableId);

    //return error if seat doesn't exist
    if(!table) {
        return next({ status: 404, message: `Table ${tableId} does not exist.` })
    }

    //confirm table is occupied
    if(table.reservation_id){
        res.locals.table = table;
        return next();
    }

    return next({ status: 400, message: `Table is not occupied.` })
}

//Makes Knex SQL query to list every table and returns it
async function list(req, res) {
    const { date } = req.query;
    const data = await service.list(date);
    res.status(200).json({ data });
}

//Makes a Knex SQL query to add a new table
async function post(req, res) {
    const data = await service.post(req.body);
    res.status(201).json({ data: data });
}

//Pull data from locals to change the status of a table and reservation to seated
async function seat(req, res) {
    const reservationId = res.locals.reservation.reservation_id;
    const tableId = req.params.table_id;
    
    const data = await service.update(tableId, reservationId);
    await resService.updateStatus("seated", reservationId);
    res.status(200).json({ data: data });
}

//Pull data from locals to update status of table and reservation after meal
async function unseat(req, res) {
    const table = res.locals.table;
    const reservationId = null;

    await resService.updateStatus("finished", table.reservation_id);   
    const data = await service.update(table.table_id, reservationId);
    res.status(200).json({ data: data });
}

module.exports = {
    list,
    seat: [validReservation, validTable, seat],
    post: [hasValidProperties, post],
    unseat: [seatingOccupied, unseat],
  }