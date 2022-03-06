const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//declare valid properties and statuses
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

const validStatuses = [
  "booked",
  "seated",
  "finished",
  "cancelled"
];

const acceptableStatuses = [
  "reservation_id",
  "created_at",
  "updated_at"
];

//Check if sent data has valid properties
function hasValidProperties(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  const data = req.body;

  //error if no data
  if(!data) { 
    return next({ status: 400, message: `Requires request body.` });
  }

  //date and time regex
  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  const timeRegex = /[0-9]{2}:[0-9]{2}/;
  
  //confirms properties exist and have appropriate values
  validProperties.forEach((prop) => {
    if(!data[prop]){
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_date" && !dateRegex.test(data.reservation_date)) {
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_time" && !timeRegex.test(data.reservation_time)) {
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "people" && !Number.isInteger(data.people)) {
      return next({ status: 400, message: `Requires ${prop}.` });
    }
  })

  next();
}

//Check if sent data has any properties that aren't acceptable
function hasOnlyValidProperties(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  const data = req.body;

  //confirm no unexpected properties exist
  for(const prop in data) {
    if(!validProperties.includes(prop)) {

      //check for valid status
      if(prop === "status") { 
        if(data.status !== "booked"){
          return next({ status: 400, message: `Status cannot be initiated as ${data.status}.` })
        }
        continue; 
      }

      //allow acceptable but not-required properties
      if(acceptableStatuses.includes(prop)) continue;

      return next({ status: 400, message: `${prop} is not a valid property.` })
    }
  }

  return next();
}

//Check if the date is valid
function onlyValidDates(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  const data = req.body;

  //get day of the week
  const rDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = weekday[rDate.getDay()];

  //return error if date is a past Tuesday
  if(day === "Tuesday" && rDate < new Date()) {
    return next({ status: 400, message: `Cannot schedule in the past or on Tuesdays.` })
  }

  //return error if it's Tuesday
  if(day === "Tuesday") {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays.` })
  }

  //return error if date is in the past
  if(rDate < new Date()) {
    return next({ status: 400, message: `Must schedule in the future.` })
  }

  //return error if time is after 9:30
  if(data.reservation_time > "21:30:00"){
    return next({ status: 400, message: `Must schedule before 9:30 PM.` });
  }

  //return error if time before opening
  if(data.reservation_time < "10:30:00"){
    return next({ status: 400, message: `Must schedule after 10:30 AM.` });
  }

  return next();
}

//Confirms reservation exists and saves it into locals
async function reservationExists(req, res, next) {
  //get reservation
  const {reservation_Id} = req.params;
  const reservation = await service.read(reservation_Id);

  //if it exists, save reservation to locals and move to next
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  } 

  //return error if no reservation
  return next({ status: 404, message: `Reservation ${req.params.reservation_Id} not found.` })
}

//Confirms the status being used to update is valid
async function validStatus(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  const data = req.body;

  const reservation = res.locals.reservation;

  //confirms that status is valid
  if(!validStatuses.includes(data.status)){
    return next({ status: 400, message: `${data.status} is not a valid status.`})
  }

  //returns error if trying to cancel a seated or finished reservation 
  if(data.status === "cancelled" && reservation.status !== "booked") {
    return next({ status: 400, message: "Only reservations that are booked can be cancelled."})
  }

  //returns error if reservation is already finished
  if(reservation.status === "finished") {
    return next({ status: 400, message: `Cannot change status of finished reservation.`})
  }

  next();
}

//Query and return list of reservations by phone number or by date
async function list(req, res) {
  const { date, mobile_number } = req.query;

  //determine which type of list query is made
  if(mobile_number) {
    //retrieve query data
    const data = await service.listByPhone(mobile_number);

    //trim date data
    data.forEach((reservation) => {
      reservation.reservation_date = reservation.reservation_date.toISOString().split("T")[0]
    });

    res.status(200).json({ data });
  } else {
    //retrieve query data
    const data = await service.list(date);

    //trim date data
    data.forEach((reservation) => {
      reservation.reservation_date = reservation.reservation_date.toISOString().split("T")[0]
    });
    
    res.status(200).json({ data });
  }
}

//Trim the date variable and return properly formated single reservation data
async function read(req, res) {
  const data = res.locals.reservation;
  data.reservation_date = data.reservation_date.toISOString().split("T")[0];
  res.json({ data });
}

//Post reservation data then return it
async function post(req, res) {
  const data = await service.post(req.body);
  res.status(201).json({ data: data });
}

//Update status of a reservation and return that reservation's data
async function updateStatus(req, res) {
  const reservation = res.locals.reservation;
  const data = await service.updateStatus(req.body.status, reservation.reservation_id);
  res.status(200).json({ data: data });
}

//Update a reservation and return the data
async function put(req, res) {
  const data = await service.put(req.body);
  res.status(200).json({ data: data });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(reservationExists), read],
  post: [hasValidProperties, hasOnlyValidProperties, onlyValidDates, asyncErrorBoundary(post)],
  updateStatus: [asyncErrorBoundary(reservationExists), validStatus, updateStatus],
  put: [asyncErrorBoundary(reservationExists), hasValidProperties, hasOnlyValidProperties, onlyValidDates, put]
}