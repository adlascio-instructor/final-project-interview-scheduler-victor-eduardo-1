/* - Get all interviews for a given day*/
SELECT
    interviews.student as "student",
    appointments.time as "time",
    interviewers.name as "interviewer"
FROM
    appointments
    INNER JOIN interviews ON interviews.appointment_id = appointments.id
    INNER JOIN interviewers ON interviews.interviewer_id = interviewers.id
WHERE
    appointments.day_id = 2
ORDER BY
    appointments.time;

/*
 *
 * 
 */
/* - Get all interviewers  */
SELECT
    interviewers.name as "interviewer"
FROM
    interviewers;

/*
 *
 * 
 */
/* - Get all available interviewers for a given day */
SELECT
    days.name as "Day",
    interviewers.name as "Interviewer"
FROM
    interviewers
    LEFT JOIN available_interviewers on interviewers.id = available_interviewers.interviewer_id
    LEFT JOIN days on available_interviewers.day_id = days.id
ORDER BY
    days.id;

/*
 *
 * 
 */
/* - Get all available appointments for a given day */
SELECT
    days.name as "Day",
    count (*)
from
    appointments
    LEFT JOIN days ON days.id = appointments.day_id
GROUP BY
    days.id,
    appointments.day_id
ORDER BY
    days.id;

/*
 *
 * 
 */