import React, { useState, useEffect } from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import axios from "axios";
import "./styles.scss";

const Appointment = (props) => {
  const [add, setAdd] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [interviewers, setInterviewer] = React.useState([]);
 


  useEffect(() => {
  
    axios.get(`http://localhost:8000/getInterviewers`)
      .then((res) => {
        console.log("RES DATAA appointr"+JSON.stringify(res.data))
       
        let data=res.data;

        setInterviewer(res.data);
      })
  }, [])


  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer,
    };
    console.log("INTERVIEW"+interview.student)
    console.log("interviewer"+interview.interviewer.name)
    setEdit(false);
    props.bookInterview(interview);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? (
        isDeleting ? (
          <Confirm
            message={"Are you sure you want to delete?"}
            onCancel={() => setIsDeleting(false)}
            onConfirm={() => {
              props.cancelInterview(props.id);
              setIsDeleting(false);
            }}
          />
        ) : edit ? (
          <Form
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            interviewers={interviewers}
            onSave={save}
            onCancel={() => setEdit(false)}
          />
        ) : (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            interviewers={interviewers}
            onEdit={() => setEdit(true)}
            onDelete={() => setIsDeleting(true)}
          />
        )
      ) : add ? (
        <Form
          interviewers={interviewers}
          onSave={save}
          onCancel={() => setAdd(false)}
        />
      ) : (
        <Empty onAdd={() => setAdd(true)} />
      )}
    </article>
  );
};

export default Appointment;
