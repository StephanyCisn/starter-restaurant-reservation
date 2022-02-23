const knex = require("../db/connection");

async function list(date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .andWhereNot({"status": "cancelled"})
        .orderBy("reservation_time");
};


module.exports = {
    list,
   
    
}
