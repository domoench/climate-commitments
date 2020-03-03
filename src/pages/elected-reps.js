import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import axios from "axios"
import Representative from "../components/representative"

export default class ElectedReps extends React.Component {
  state = {
    address: "",
    officials: [],
    offices: [],
    error: "", // Question: should this be part of the state?
  }

  // Updates address as user inputs it
  handleChange = event => {
    this.setState({ address: event.target.value })
  }

  // Handles submitting the address input form
  handleSubmit = event => {
    event.preventDefault()

    // Reset state
    this.setState({
      officials: [],
      offices: [],
      error: "",
    })

    axios
      .get("https://www.googleapis.com/civicinfo/v2/representatives", {
        params: {
          address: this.state.address,
          key: process.env.CIVIC_API_KEY,
        },
      })
      .then(res => {
        this.setState({
          officials: res.data.officials,
          offices: res.data.offices.filter(
            office =>
              office.name === "U.S. Representative" ||
              office.name === "U.S. Senator"
          ),
        })
        console.log(this.state.officials)
      })
      // Question: Is this how I should be catching the errors?
      .catch(e => {
        console.log(e)
        this.setState({
          error:
            "Sorry, we failed to look up your representative. Please try entering your zip code again.",
        })
      })
  }

  render() {
    return (
      <Layout>
        <SEO title="Page two" />

        <form onSubmit={this.handleSubmit}>
          <h1>Call your representative.</h1>
          <div className="form-group">
            <label>
              Zip code or full address:{" "}
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                aria-describedby="address"
                placeholder="Enter your zip code"
                onChange={this.handleChange}
                required
              />
            </label>

            <small id="addressLabel" className="form-text text-muted">
              Your information is not saved or stored.
            </small>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <p
          className={`alert alert-danger ${
            this.state.error ? "d-block" : "d-none"
          }`}
          role="alert"
        >
          {this.state.error}
        </p>

        <div
          className={`results ${
            this.state.offices.length > 0 ? "d-block" : "d-none"
          }`}
        >
          <h3>Here is the contact information for your representatives:</h3>

          <div className="row mb-5">
            {this.state.offices.map((office, index) => (
              <Representative
                key={index}
                name={
                  this.state.officials[parseInt(office.officialIndices)].name
                }
                title={office.name}
                phone={
                  this.state.officials[parseInt(office.officialIndices)].phones
                }
                website={
                  this.state.officials[parseInt(office.officialIndices)].urls
                }
                photo={
                  this.state.officials[parseInt(office.officialIndices)]
                    .photoUrl
                }
              />
            ))}
          </div>

          <button className="btn btn-primary mb-5 btn-lg btn-block">
            Commit to Calling
          </button>
        </div>

        <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}
