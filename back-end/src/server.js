const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

  const cors=require("cors");
  const corsOptions ={
     origin:'*', 
     credentials:true,            //access-control-allow-credentials:true
     optionSuccessStatus:200,
  }
  
  app.use(cors(corsOptions)) // Use this after the variable declaration


function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
