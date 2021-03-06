import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div>
      <h1 className="lead">Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <ul>
      <li>
        <Link to="/commitments">Commitments Flow</Link>
      </li>
      <li>
        <Link to="/elected-reps/">Elected Reps</Link>
      </li>
      <li>
        <Link to="/viz/">Data Visualization</Link>
      </li>
    </ul>
  </Layout>
)

export default IndexPage
