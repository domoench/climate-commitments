import React from "react"

const Representative = props => {
  // Question: do we want to add website or photo to this?
  return (
    <div className="card m-1" style={{ width: "15rem" }}>
      <img
        src={`${props.photo}`}
        style={{ height: "15rem", objectFit: "cover" }}
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">Your {props.title}</h6>
        <p className="card-text">
          Contact {props.name} and ask them to pledge to refuse to accept
          donations from fossil fuel companies by taking the No Fossil Fuel
          Money Pledge.
        </p>
        <a href={`tel:${props.phone}`} className="btn btn-success">
          <svg
            id="i-telephone"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="none"
            stroke="currentcolor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M3 12 C3 5 10 5 16 5 22 5 29 5 29 12 29 20 22 11 22 11 L10 11 C10 11 3 20 3 12 Z M11 14 C11 14 6 19 6 28 L26 28 C26 19 21 14 21 14 L11 14 Z" />
            <circle cx="16" cy="21" r="4" />
          </svg>{" "}
          {props.phone}
        </a>
      </div>
    </div>
  )
}

export default Representative
