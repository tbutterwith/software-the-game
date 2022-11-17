import React, { useState } from "react";
import useInterval from "./util/useInterval";
import "./App.css";
import CompanyStats from "./sections/CompanyStats";
import Purchasable from "./Purchaseable";
import DeveloperUpgrades from "./Upgrades/DeveloperUpgrades";
import InfrastructureUpgrades from "./Upgrades/InfrastructureUpgrades";
import { Upgradable } from "./Upgrades/Upgradable";

const cycleTimeMs = 333;
const bugsPerFeatureRate = 0.45;
const newUserRate = 0.5;
const revenuePerUser = 0.4 / cycleTimeMs;

const costPerDev = 50 / cycleTimeMs;

const baseDeveloperPrice = 20;

function App() {
  const [revenue, updateRevenue] = useState(100);

  const [users, updateUsers] = useState(1);
  const [featuresPerDev, updateFeaturesPerDev] = useState(5 / cycleTimeMs);

  const [featureDevsCount, updateFeatureDevsCount] = useState(1);
  const [bugFixDevsCount, updateBugFixDevsCount] = useState(0);

  const [availableThroughput, updateAvailableThroughput] = useState(1000);

  const [roundedFeatureCount, updateRoundedFeatureCount] = useState(1);
  const [featuresCount, updateFeaturesCount] = useState(1);
  const [roundedBugsCount, updateRoundedBugsCount] = useState(0);
  const [bugsCount, updateBugsCount] = useState(0);

  const [upgrades, updateUpgrades] = useState({
    developerUpgrades: DeveloperUpgrades,
    infxUpgrades: InfrastructureUpgrades,
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
      // is it a bug? If we have over 50 features, we're twice as likely to
      // see bugs
      let calcBugsPerFeatureRate = bugsPerFeatureRate;
      if (featuresCount > 50) calcBugsPerFeatureRate *= 2;
      const bugChance = Math.random();
      if (bugChance <= calcBugsPerFeatureRate) {
        updatedFeatures -= 1;
        updatedRoundedFeatures -= 1;

        updatedBugs += 1;
      }
    }

    const newUsers =
      users + Math.round(Math.random() * newUserRate * featuresCount);
    if (calculateThroughput() <= availableThroughput) updateUsers(newUsers);

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

  const calculateFeaturesRate = () => {
    const ratePerCycle = featureDevsCount * featuresPerDev;
    const ratePerSecond = ratePerCycle * (1000 / cycleTimeMs);
    return ratePerSecond.toFixed(2);
  };

  const getDeveloperCount = () => featureDevsCount + bugFixDevsCount;

  const getDeveloperCost = () =>
    baseDeveloperPrice * (1 + getDeveloperCount() ** 5);

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

  const purchaseDevTool = (title: string) => {
    upgrades.developerUpgrades.forEach((upgrade) => {
      if (upgrade.title == title) {
        upgrade.purchased = true;
        updateRevenue(revenue - upgrade.cost);
        updateFeaturesPerDev(featuresPerDev * upgrade.multiplier);
      }
    });
  };

  const purchaseInfx = (title: string) => {
    upgrades.infxUpgrades.forEach((upgrade) => {
      if (upgrade.title == title) {
        upgrade.purchased = true;
        updateRevenue(revenue - upgrade.cost);
        updateAvailableThroughput(availableThroughput * upgrade.multiplier);
      }
    });
  };

  const getAvailableDevUpgrades = () => {
    const { developerUpgrades } = upgrades;

    return renderUpgrades(developerUpgrades, purchaseDevTool);
  };

  const getAvailableInfxUpgrades = () => {
    const { infxUpgrades } = upgrades;

    return renderUpgrades(infxUpgrades, purchaseInfx);
  };

  const renderUpgrades = (upgrades: Upgradable[], purchaseFn: Function) => {
    const availableUpgrades = upgrades.filter((upgrade) => !upgrade.purchased);

    return availableUpgrades
      .slice(0, 2)
      .map((upgrade) => (
        <Purchasable
          title={upgrade.title}
          desc={upgrade.desc}
          cost={upgrade.cost}
          isAffordable={revenue > upgrade.cost}
          onClick={() => purchaseFn(upgrade.title)}
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
        <div className="panel-half-width">
          <h3>Infrastructure</h3>
          <div>Used Throughput: {calculateThroughput()} ops/s</div>
          <div>Available Throughput: {availableThroughput} ops/s</div>
        </div>
        <div className="panel-half-width">{getAvailableInfxUpgrades()}</div>
      </div>
    </div>
  );
}

export default App;
