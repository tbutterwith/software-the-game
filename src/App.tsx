import React, { useState } from "react";
import useInterval from "./util/useInterval";
import "./App.css";
import CompanyStats from "./sections/CompanyStats";
import Purchasable from "./Purchaseable";
import DeveloperUpgrades from "./Upgrades/DeveloperUpgrades";

const cycleTimeMs = 333;
const bugsPerFeatureRate = 0.45;
const newUserRate = 0.5;
const revenuePerUser = 0.5 / cycleTimeMs;

const costPerDev = 50 / cycleTimeMs;
const featuresPerDev = 5 / cycleTimeMs;
const baseDeveloperPrice = 20;

function App() {
  const [revenue, updateRevenue] = useState(100);

  const [users, updateUsers] = useState(1);

  const [featureDevsCount, updateFeatureDevsCount] = useState(1);
  const [bugFixDevsCount, updateBugFixDevsCount] = useState(0);

  const [roundedFeatureCount, updateRoundedFeatureCount] = useState(1);
  const [featuresCount, updateFeaturesCount] = useState(1);
  const [roundedBugsCount, updateRoundedBugsCount] = useState(0);
  const [bugsCount, updateBugsCount] = useState(0);

  const [upgrades, updateUpgrades] = useState({
    developerUpgrades: DeveloperUpgrades,
  });

  useInterval(() => {
    // Calculate revenue
    const updatedRevenue = revenue + calculateRevenuePerCycle();
    updateRevenue(updatedRevenue);

    // Generate features and bugs for the next cycle
    let updatedFeatures = featuresCount + featureDevsCount * featuresPerDev;
    let updatedRoundedFeatures = Math.floor(updatedFeatures);

    let updatedBugs = bugsCount - bugFixDevsCount * featuresPerDev;

    if (updatedRoundedFeatures > roundedFeatureCount) {
      // is it a bug?
      const bugChance = Math.random();
      if (bugChance <= bugsPerFeatureRate) {
        updatedFeatures -= 1;
        updatedRoundedFeatures -= 1;

        updatedBugs += 1;
      }
    }

    const newUsers =
      users + Math.round(Math.random() * newUserRate * featuresCount);
    if (calculateThroughput() <= calculateAvailableThroughput())
      updateUsers(newUsers);

    updateRoundedFeatureCount(updatedRoundedFeatures);
    updateFeaturesCount(updatedFeatures);

    const roundedBugs = Math.max(updatedBugs, 0);

    updateBugsCount(roundedBugs);
    updateRoundedBugsCount(Math.floor(roundedBugs));
  }, cycleTimeMs);

  const calculateRevenuePerCycle = () => {
    return (
      (roundedFeatureCount - roundedBugsCount) * revenuePerUser * users -
      costPerDev * getDeveloperCount()
    );
  };

  const calculateRevenueRate = () => {
    return (calculateRevenuePerCycle() * (1000 / cycleTimeMs)).toFixed(2);
  };

  const calculateThroughput = () => users * 2;
  const calculateAvailableThroughput = () => 1000;

  const calculateFeaturesRate = () => {
    const ratePerCycle = featureDevsCount * featuresPerDev;
    const ratePerSecond = ratePerCycle * (1000 / cycleTimeMs);
    return ratePerSecond.toFixed(2);
  };

  const getDeveloperCount = () => featureDevsCount + bugFixDevsCount;

  const getDeveloperCost = () =>
    baseDeveloperPrice * (1 + getDeveloperCount() ** 3);

  const canHireDeveloper = () => revenue >= getDeveloperCost();

  const addDev = () => {
    if (!canHireDeveloper()) return;

    updateRevenue(revenue - getDeveloperCost());
    updateFeatureDevsCount(featureDevsCount + 1);
  };

  const addFeatureDev = () => {
    if (bugFixDevsCount <= 0) return;

    updateBugFixDevsCount(bugFixDevsCount - 1);
    updateFeatureDevsCount(featureDevsCount + 1);
  };

  const addBugDev = () => {
    if (featureDevsCount <= 0) return;

    updateFeatureDevsCount(featureDevsCount - 1);
    updateBugFixDevsCount(bugFixDevsCount + 1);
  };

  const getAvailableDevUpgrades = () => {
    const { developerUpgrades } = upgrades;

    const availableUpgrades = developerUpgrades.filter(
      (upgrade) => !upgrade.purchased
    );

    return availableUpgrades
      .slice(0, 2)
      .map((upgrade) => (
        <Purchasable
          title={upgrade.title}
          desc={upgrade.desc}
          cost={upgrade.cost}
          isAffordable={revenue > upgrade.cost}
          onClick={() => console.log("Purchased thing")}
        />
      ));
  };

  return (
    <div className="App">
      <h1>Software - The Game!</h1>
      <CompanyStats
        users={users}
        featuresCount={featuresCount}
        bugsCount={bugsCount}
        featureRate={calculateFeaturesRate()}
        revenueRate={calculateRevenueRate()}
        revenue={revenue}
        featureDevsCount={featureDevsCount}
        bugFixDevsCount={bugFixDevsCount}
        totalDevCount={getDeveloperCount()}
      />
      <hr />
      <div className="panel-full-width">
        <div className="panel-half-width">
          <h3>Developers</h3>
          <div>Developer Cost: £{getDeveloperCost()}</div>
          <button onClick={addDev} disabled={!canHireDeveloper()}>
            Hire developer
          </button>
          <br />
          <button onClick={addFeatureDev} disabled={bugFixDevsCount <= 0}>
            Move dev to feature work
          </button>
          <br />
          <button onClick={addBugDev} disabled={featureDevsCount <= 0}>
            Move dev to bug fixes
          </button>
        </div>
        <div className="panel-half-width">{getAvailableDevUpgrades()}</div>
      </div>
      <hr />
      <div className="panel-full-width">
        <h3>Infrastructure</h3>
      </div>
      <div className="panel-full-width">
        <div className="panel-half-width">
          <div>Used Throughput: {calculateThroughput()} ops/s</div>
          <div>
            Available Throughput: {calculateAvailableThroughput()} ops/s
          </div>
        </div>
        <div className="panel-half-width"></div>
      </div>
    </div>
  );
}

export default App;
