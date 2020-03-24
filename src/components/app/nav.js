import "./nav.css";

import React from "React";
import { NavLink } from "react-router-dom";

const NavBar = () => (
  <div>
    <NavLink exact to="/" className="nav-item">
      头部
    </NavLink>
    |&nbsp;
    <NavLink to="/main" className="nav-item" activeClassName="active">
      主体
    </NavLink>
    |&nbsp;
    <NavLink to="/footer" className="nav-item" activeClassName="active">
      底部
    </NavLink>
    |&nbsp;
    <NavLink
      to="/PureChildComponent"
      className="nav-item"
      activeClassName="active"
    >
      PureChildComponent
    </NavLink>
    |&nbsp;
    <NavLink
      to="/reactVirtualized"
      className="nav-item"
      activeClassName="active"
    >
      无限滚动
    </NavLink>
    |&nbsp;
    <NavLink to="/grid" className="nav-item" activeClassName="active">
      grid布局
    </NavLink>
    |&nbsp;
    <NavLink to="/maptalks" className="nav-item" activeClassName="active">
      mapTalks地图
    </NavLink>
    |&nbsp;
    <NavLink to="/leaflet" className="nav-item" activeClassName="active">
      leaflet地图
    </NavLink>
    |&nbsp;
    <NavLink to="/loading" className="nav-item" activeClassName="active">
      loading效果
    </NavLink>
    |&nbsp;
    <NavLink to="/webApp" className="nav-item" activeClassName="active">
      移动端app
    </NavLink>
    |&nbsp;
    <NavLink to="/react" className="nav-item" activeClassName="active">
      404
    </NavLink>
  </div>
);

export default NavBar;
