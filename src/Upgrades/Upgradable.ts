export enum UpgradableTypes {
  DEVELOPER = 1,
  MARKETING,
  INFX,
}

export type Upgradable = {
  title: string;
  desc: string;
  cost: number;
  multiplier: number;
  type: UpgradableTypes;
  purchased: boolean;
};
