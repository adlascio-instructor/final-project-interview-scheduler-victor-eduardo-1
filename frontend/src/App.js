import React, { useState, useEffect } from "react";

import "./App.scss";

import DayList from "./components/DayList";
import Appointment from "./components/Appointment";


export default function Application() {
  const [day, setDay] = useState("");
  const [days, setDays] = useState("");
  const [appointments, setAppointments] = useState("");
  const totalAppointmentsPerDay = 5;

  //getAppointments(day)

  useEffect(() => {

    getDays();
    getDay();
    getAppointments(day);
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const isEdit = appointments[id].interview;
    setAppointments((prev) => {
      const appointment = {
        ...prev[id],
        interview: { ...interview },
      };
      const appointments = {
        ...prev,
        [id]: appointment,
      };
      return appointments;
    });
    if (!isEdit) {
      setDays((prev) => {
        const updatedDay = {
          ...prev[day],
          spots: prev[day].spots - 1,
        };
        const days = {
          ...prev,
          [day]: updatedDay,
        };
        return days;
      });
    }
  }

  function getDay() {
    console.log("DENTRO DEL GETDAY");
    setDay("Monday");
  }

  function getDays() {
    fetch("http://localhost:8000/getDaysAndAppointmentsAvailables", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let parseData = [];
        for (var i in data) {
          let day = {
            name: data[i].name,
            id: i,
            spots: totalAppointmentsPerDay - data[i].count,
          };
          parseData.push(day);
        }
        setDays(parseData);
      });
  }

  function getAppointments(day) {
    console.log(" IN getAppointments APPS " + day);

    let dayTransform = 0;

    switch (day) {
      case "Monday":
        dayTransform = 1;
        break;
      case "Tuesday":
        dayTransform = 2;
        break;
      case "Wednesday":
        dayTransform = 3;
        break;
      case "Thursday":
        dayTransform = 4;
        break;
      case "Friday":
        dayTransform = 5;
        break;
      default:
        dayTransform=1;
    }
    console.log("LOG DAY TRANS"+dayTransform);

    fetch("http://localhost:8000/getAppointmentsByDay/:"+dayTransform, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("DAATAAA appointments " + JSON.stringify(data));
        let parseData = [];

        for (var i in data) {
          let interviewer = {
            id: data[i].interviewerid,
            avatar: data[i].avatar,
            name: data[i].interviewer,
          };
          let interview = {
            student: data[i].student,
            interviewer: interviewer,
          };

          let dataAppointment = {
            id: data[i].appointmentid,
            time: data[i].time,
            interview: interview,
          };

          parseData.push(dataAppointment);
        }

        let iterator = 0;

        while (iterator < 6) {
          let calc = iterator + 12;
          let timeToCheck = calc.toString();
          timeToCheck = timeToCheck + "pm";
          const result = parseData.find(({ time }) => time === timeToCheck);

          if (!result) {
            let dataAppointment = {
              id: iterator * 2,
              time: timeToCheck,
            };
            parseData.push(dataAppointment);
          }

          iterator++;
        }
        parseData.sort(
          (firstItem, secondItem) =>
            firstItem.time.substring(0, 2) - secondItem.time.substring(0, 2)
        );

        setAppointments(parseData);
        console.log("PROPPPSS"+JSON.stringify(appointments))
      });
  }

  function cancelInterview(id) {
    setAppointments((prev) => {
      const updatedAppointment = {
        ...prev[id],
        interview: null,
      };
      const appointments = {
        ...prev,
        [id]: updatedAppointment,
      };
      return appointments;
    });
    setDays((prev) => {
      const updatedDay = {
        ...prev[day],
        spots: prev[day].spots + 1,
      };
      const days = {
        ...prev,
        [day]: updatedDay,
      };
      return days;
    });
  }
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} value={day} onChange={setDay} />
        </nav>
      </section>
      <section className="schedule">
        {Object.values(appointments).map((appointment) => (
          <Appointment
            key={appointment.id}
            {...appointment}
            bookInterview={(interview) =>
              bookInterview(appointment.id, interview)
            }
            cancelInterview={cancelInterview}
          />
        ))}
        {/* <Appointment key="last" time="54pm" /> */}
      </section>
    </main>
  );
}
