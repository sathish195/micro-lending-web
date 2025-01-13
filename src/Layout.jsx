import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/comman/Header";
import Sidebar from "./components/comman/Sidebar";
import Footer from "./components/comman/Footer";
// import Dashboard from './components/dashbord/Dashbord';/
class Layout extends Component {
  state = {};
  render() {
    return (
      <>
        <Header></Header>
        <Sidebar></Sidebar>
        {/* <Dashboard/> */}
        <div className="main-panel">
          <div className="content-wrapper container-fluid">

            <Outlet />
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }
}

export default Layout;
