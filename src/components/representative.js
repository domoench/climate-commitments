import React from "react"

const Representative = props => {
  // Question: do we want to add website or photo to this?
  return (
    <div style={{ marginBottom: "2rem" }}>
      <p style={{ marginBottom: "1px" }}>
        <b>{props.name},</b> <span>{props.title}</span>
      </p>
      <a href={`${props.phone}`}>
        {" "}
        <span style={{ paddingRight: "10px" }}>
          {" "}
          <svg
            aria-hidden="true"
            focusable="false"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1056 1056"
          >
            <path
              d="M1016 788q-4-4-25-18t-49-32.5l-56-37l-50-33l-28-17.5q-4-3-9.5-5t-11-3t-11.5-1q-4 0-7 .5t-6.5 1t-7.5 1.5t-7.5 2t-7 2.5t-7.5 3t-7 3.5q-19 10-91 51q-61-43-152-134q-90-90-133-151q41-73 51-91q26-50 5-83q-11-17-70.5-107T268 39q-17-24-52-24q-9 0-17.5 2t-17 5.5T165 31q-5 4-16.5 13t-37 30.5t-45.5 42t-36 45T15 204q1 42 15 88.5T68 385t53.5 91t66.5 90t71 82.5t72 75.5q59 59 118 109.5t128.5 99t141 77.5t134.5 31h1q17 0 41-16t44.5-36.5t42-45T1012 907l12-16q31-44 9-84q-7-12-17-19zm-44 65q-30 42-67 79.5T851 977q-90-5-212.5-81.5T376.5 679T160 416.5T79 205q6-17 43.5-54T202 84q2-2 4-3t4.5-1.5t5.5-.5q1 0 2 1q60 86 132 199q0 8-6 21q-2 3-5 9t-7.5 14t-10.5 18t-12.5 22t-14.5 26l-20 35l23 33q47 67 141 161t160 140l33 24l36-20q29-17 54-31.5t35-18.5q11-7 20-7h1q81 51 200 133q1 7-5 15zM700 398l275-273l-1 155q0 10 7 17t16 7h17q4 0 8.5-1.5t8-4.5t5-7t2.5-8V52l-.5-.5l-.5-.5l2-12q0-10-6-16q-3-3-7.5-5t-8.5-2l-12 1h-1l-229-1q-3 0-5.5.5t-5 2t-4.5 3t-3.5 3.5t-3 4.5t-2 5t-.5 5.5v16q1 11 9 17.5t18 6.5h151L655 353q-10 9-10 22.5t9.5 23t23 9.5t22.5-10z"
              fill="#626262"
            />
          </svg>
        </span>
        {props.phone}
      </a>
      <br />
    </div>
  )
}

export default Representative
