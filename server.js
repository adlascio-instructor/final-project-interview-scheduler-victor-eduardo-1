const express = require("express");
const scheduler_model = require("./schedule_model");
const app = express();
const port = 8000;

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/getDaysAndAppointmentsAvailables", (req, res) => {
  // res.status(200).send('Hello World!');

  scheduler_model
    .getDaysAndAppointmentsAvailables()
    .then((response) => {
      console.log("im alive" + JSON.stringify(response[4].count));
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/getAppointmentsByDay/:id", (req, res) => {
  console.log(" IN SERVER"+req.params.id);
  let id = req.params.id;
  id = id.substring(1);
  console.log("ID ---->"+id);
  scheduler_model
    .getAppointments(id)
    .then((response) => {
      console.log("APPOinments :" + JSON.stringify(response));
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
