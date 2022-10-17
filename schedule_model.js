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

const getInterviewers =() => 
{
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM interviewers',
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });

}

const getAppointments =(day_id) => 
{
  return new Promise(function (resolve, reject) {
    pool.query(
      `SELECT
      appointments.time as "time",
      interviews.student as "student",
      interviewers.name as "interviewer",
      interviewers.id as "interviewerid",
      interviewers.avatar as "avatar",
      appointments.id as "appointmentid"
  FROM
      appointments
      INNER JOIN interviews ON interviews.appointment_id = appointments.id
      INNER JOIN interviewers ON interviews.interviewer_id = interviewers.id
  WHERE
      appointments.day_id = ${day_id}
  ORDER BY
      appointments.time`,
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
  getAppointments,
  getInterviewers,
};
