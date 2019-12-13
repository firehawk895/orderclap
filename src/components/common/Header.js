import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const activeStyle = { color: "#F15B2A" };
  return (
    <nav>
      <NavLink to="/crustos" activeStyle={activeStyle} exact>
        Orders
      </NavLink>
      {" | "}
      <NavLink to="/place_order" activeStyle={activeStyle}>
        Place Order
      </NavLink>
    </nav>
  );
};

export default Header;
