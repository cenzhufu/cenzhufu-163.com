import "core-js/fn/object/assign";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import App from './components/Main';
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Main from "./components/main/Main";
import NavBar from "./components/app/nav";
import PureChildComponent from "./components/pureChildComponent";
import ReactVirtualized from "./components/reactVirtualized";
import ReactGrid from "./components/reactGrid";
import Map from "./components/map";
import Leaflet from "./components/leaflet";
import Loading from "./components/loading";
// import WebApp from "./components/WebApp";

import "antd/dist/antd.css";
import "./index.css";
// Render the main component into the dom
ReactDOM.render(
  <Router>
    <div>
      <NavBar />
      <Route exact path="/" component={Header} />
      <Route path="/main" component={Main} />
      <Route path="/footer" component={Footer} />
      <Route path="/PureChildComponent" component={PureChildComponent} />
      <Route path="/reactVirtualized" component={ReactVirtualized} />
      <Route path="/grid" component={ReactGrid} />
      <Route path="/maptalks" component={Map} />
      <Route path="/leaflet" component={Leaflet} />
      <Route path="/loading" component={Loading} />
      {/* <Route path="/webApp" component={WebApp} /> */}
    </div>
  </Router>,
  document.getElementById("app")
);
