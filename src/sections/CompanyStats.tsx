import React from "react";

type props = {
  featuresCount: number;
  bugsCount: number;
  featureRate: string;
  revenueRate: string;
  revenue: number;
  featureDevsCount: number;
  bugFixDevsCount: number;
  totalDevCount: number;
};

const CompanyStats = ({
  featuresCount,
  bugsCount,
  featureRate,
  revenueRate,
  revenue,
  featureDevsCount,
  bugFixDevsCount,
  totalDevCount,
}: props) => (
  <>
    <div className="panel-full-width">
      <h3>Company Stats</h3>
    </div>
    <div className="panel-full-width">
      <div className="panel-half-width">
        <div>Users: 0</div>
        <br />
        <div>Features: {Math.floor(featuresCount)}</div>
        <div>Bugs: {Math.floor(bugsCount)}</div>
        <br />
        <div>Features rate: {featureRate} per second</div>
        <div>Revenue rate: {revenueRate} per second</div>
      </div>
      <div className="panel-half-width">
        <div>Total Developers: {totalDevCount}</div>
        <div>Feature Devs: {featureDevsCount}</div>
        <div>Bug Fix Devs: {bugFixDevsCount}</div>
        <br />
        <div>Cash reserves: £{revenue.toFixed(2)}</div>
      </div>
    </div>
  </>
);

export default CompanyStats;
