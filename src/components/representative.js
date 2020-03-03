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
          Call: {props.phone}
        </a>
      </div>
    </div>
  )
}

export default Representative
