import React from "react";
import { useNavigate } from "react-router-dom";
import "./Registration_css.css";

export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <span className="icon_back">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>&#60;</span> Back
        </button>
      </span>
      <span className="header-push text-white">{title}</span>
    </div>
  );
}
