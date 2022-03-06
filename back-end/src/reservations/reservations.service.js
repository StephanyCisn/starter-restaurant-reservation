const knex = require("../db/connection");

//Make a knex SQL query to find all reservations for a specific date, excluding some statuses
function list(date) {
  return knex("reservations")
        .whereNot({ status: "finished" })
        .andWhereNot({ status: "cancelled" })
        .andWhere({ "reservation_date": date })
        .orderBy("reservation_time", "asc")
        .then();
}

//Make a knex SQL query to find all reservations for the specific phone number
function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

//Make a knex SQL query to return a specific reservation
function read(reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .first()
        .then();
}

//Make a knex SQL query to add a new reservation
function post(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

//Make a knex SQL query to update the status of a reservation
function updateStatus(status, reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .update( "status", status)
        .returning("*")
        .then((records) => records[0]);
}

//Make a knex SQL query to update a reservation
function put(reservation) {
  return knex("reservations")
        .where({ "reservation_id": reservation.reservation_id })
        .update(reservation)
        .returning("*")
        .then((records) => records[0]);
}

module.exports = {
  list,
  listByPhone,
  read,
  post,
  updateStatus,
  put,
}