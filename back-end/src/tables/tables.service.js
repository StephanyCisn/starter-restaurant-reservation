const knex = require("../db/connection");

//Make a knex SQL query to return all tables, ordered by name
function list() {
  return knex("tables")
        .groupBy("tables.table_id")
        .orderBy("tables.table_name")
        .then();
}

//Make a knex SQL query to return a single table
function read(tableId) {
  return knex("tables")
        .select("*")
        .where({ "table_id": tableId })
        .first();
}

//Make a knex SQL query to add new table data
function post(data) {
    return knex("tables")
        .insert(data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

//Make a knex SQL query to seat a reservation at a table
function update(tableId, reservationId) {
  return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .update( "reservation_id", reservationId );
}

//Make a knex SQL query to return a specific reservation's data
function readRes(reservationId) {
  return knex("reservations")
        .where({ "reservation_id": reservationId })
        .first();
}

module.exports = {
  list,
  post,
  update,
  read,
  readRes
}