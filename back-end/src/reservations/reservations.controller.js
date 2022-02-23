/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");

 async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (date) {
    const data = await service.list(date);
    res.json({
    data,
    });
  }
 
 
 

module.exports = {
  list,
};
