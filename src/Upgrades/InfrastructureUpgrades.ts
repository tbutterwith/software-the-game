import { Upgradable, UpgradableTypes } from "./Upgradable";

const InfrastructureUpgrades: Upgradable[] = [
  {
    title: "Buy another Raspberry Pi",
    desc: "Increase throughput by 100%",
    type: UpgradableTypes.INFX,
    cost: 500,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Install water cooling",
    desc: "Increase throughput by 100%",
    type: UpgradableTypes.INFX,
    cost: 1000,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Upgrade your home broadband",
    desc: "Increase throughput by 100%",
    type: UpgradableTypes.INFX,
    cost: 10000,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Move to a data center",
    desc: "Increase throughput by 100%",
    type: UpgradableTypes.INFX,
    cost: 40000,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Read a blog about kubernetes and understand some of it",
    desc: "Increase throughput by 100%",
    type: UpgradableTypes.INFX,
    cost: 120000,
    multiplier: 2,
    purchased: false,
  },
  {
    title: "Migrate to the cloud",
    desc: "Increase throughput by 500%",
    type: UpgradableTypes.INFX,
    cost: 250000,
    multiplier: 5,
    purchased: false,
  },
];

export default InfrastructureUpgrades;
