import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../images/logo1.png"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Image from "react-bootstrap/Image"
const Header = ({ siteTitle }) => (
  <Navbar bg="light" className="justify-content-center mb-5">
    <Link to="/">
      <Navbar.Brand>
        <Image
          src={logo}
          style={{ height: "50px", marginBottom: "10px" }}
        ></Image>
      </Navbar.Brand>
    </Link>
  </Navbar>
)

export default Header
