const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scheduledb",
  password: "gatrox1989",
  port: 5432,
});

const getDaysAndAppointmentsAvailables = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT days.name,  count (*) from appointments LEFT JOIN days ON days.id = appointments.day_id GROUP BY days.id, appointments.day_id ORDER BY days.id',
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });
};

const getDays =() => 
{
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM days',
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });


}

module.exports = {
  getDaysAndAppointmentsAvailables,
  getDays,
};
