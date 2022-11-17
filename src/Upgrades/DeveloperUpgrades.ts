import { Upgradable, UpgradableTypes } from "./Upgradable";

const DeveloperUpgrades: Upgradable[] = [
  {
    title: "New keyboards for all!",
    desc: "Increase developer productivity by 100%",
    type: UpgradableTypes.DEVELOPER,
    cost: 500,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Beanbag chairs?",
    desc: "Increase developer productivity by 50%",
    type: UpgradableTypes.DEVELOPER,
    cost: 1000,
    multiplier: 1.5,
    purchased: false,
  },
  {
    title: "Free breakfast bar",
    desc: "Increase developer productivity by 50%",
    type: UpgradableTypes.DEVELOPER,
    cost: 10000,
    multiplier: 1.5,
    purchased: false,
  },
  {
    title: "Fix the coffee machine",
    desc: "Increase developer productivity by 100%",
    type: UpgradableTypes.DEVELOPER,
    cost: 40000,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Casual Fridays",
    desc: "Increase developer productivity by 50%",
    type: UpgradableTypes.DEVELOPER,
    cost: 120000,
    multiplier: 1.5,
    purchased: false,
  },
  {
    title: "Hold a Company Offsite",
    desc: "Increase developer productivity by 500%",
    type: UpgradableTypes.DEVELOPER,
    cost: 250000,
    multiplier: 5,
    purchased: false,
  },
];

export default DeveloperUpgrades;
