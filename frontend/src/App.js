import React, { useState, useEffect } from "react";

import "./App.scss";

import DayList from "./components/DayList";
import Appointment from "./components/Appointment";
import daysData from "./components/__mocks__/days.json";
import appointmentsData from "./components/__mocks__/appointments.json";

export default function Application() {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState("");
  const [appointments, setAppointments] = useState("");
  const totalAppointmentsPerDay = 5;

  useEffect(() => {
    getDays();
    getAppointments();
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

  function getAppointments() {
    console.log(" IN getAppointments APPS ");
    fetch("http://localhost:8000/getAppointmentsByDay/:1", {
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

        // "2": {
        //   "id": 2,
        //   "time": "1pm",
        //   "interview": {
        //     "student": "Lydia Miller-Jones",
        //     "interviewer": {
        //       "id": 3,
        //       "name": "Sylvia Palmer",
        //       "avatar": "https://i.imgur.com/LpaY82x.png"
        //     }
        //   }
        // },

        for (var i in data) {
          let interviewer = {
            id: data[i].interviewerid,
            avatar: data[i].avatar,
            name: data[i].name,
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
        setAppointments(parseData);
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
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
