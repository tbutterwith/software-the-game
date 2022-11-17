import React from "react";
import "./Purchasable.css";

type Props = {
  title: string;
  desc: string;
  cost: number;
  isAffordable: boolean;
  onClick: Function;
};

const Purchasable = ({ title, desc, cost, isAffordable, onClick }: Props) => (
  <div
    onClick={() => {
      if (isAffordable) onClick();
    }}
    className={`purchasable ${!isAffordable ? "not-affordable" : ""}`}
  >
    <h3>{title}</h3>
    <p className="purchasable-desc">{desc}</p>
    <p>£{cost}</p>
  </div>
);

export default Purchasable;
