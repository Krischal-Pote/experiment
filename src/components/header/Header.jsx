import React from "react";
import "./Header.css";
import reactLogo from "../../assets/react.svg";
import { useTour } from "@reactour/tour";
const Header = () => {
  const { setIsOpen } = useTour();
  return (
    <header className="header">
      <div className="first-step">
        <img src={reactLogo} alt="" />
      </div>
      <nav>
        <ul>
          <li className="second-step">
            <a href="#">Home</a>
          </li>
          <li className="third-step">
            <a href="#">About</a>
          </li>
          <li className="fourth-step">
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
