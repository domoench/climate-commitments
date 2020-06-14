import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../images/logo.png"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Image from "react-bootstrap/Image"
const Header = ({ siteTitle }) => (
  <Navbar className="justify-content-center mb-2">
    <Link to="/">
      <Navbar.Brand>
        <Image
          src={logo}
          style={{ height: "100px", marginBottom: "10px" }}
        ></Image>
      </Navbar.Brand>
    </Link>
  </Navbar>
)

export default Header
