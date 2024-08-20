// Cost. Power Level boost percentage. Hull Boost. Shield Armor boost.
export const addons = {
    'None': { cost: 0, powerLevelBoost: 0, hullPointsBoost: 0, shieldArmorPointsBoost: 0},
    'Advanced Shields': { cost: 1, powerLevelBoost: 1, hullPointsBoost: 20, shieldArmorPointsBoost: 200 },
    'Heavy Armor': { cost: 1, powerLevelBoost: 1, hullPointsBoost: 0, shieldArmorPointsBoost: 0 },
    'High Speed': { cost: 1.5, powerLevelBoost: 1.5, hullPointsBoost: 0, shieldArmorPointsBoost: 0 },
};

export const primaryArm = {
    'None': { cost: 1, powerLevelBoost: 1, lightAttack: 0, mediumAttack: 0, heavyAttack: 0 },
    'Laser Cannons': { wCost: -100, weaponPL: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Proton Torpedoes': { wCost: 1, weaponPL: 10, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Ion Cannons': { wCost: 1, weaponPL: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Concussion Missiles': { wCost: 1, weaponPL: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
};

export const secondaryArm = {
    'No secondary': { cost: 1, powerLevelBoost: 1, lightAttack: 0, mediumAttack: 0, heavyAttack: 0 },
    'Secondary Laser Cannons': { cost: 100, powerLevelBoost: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Level 1 Laser Turret': { cost: 1000, powerLevelBoost: 1.1, lightAttack: 5, mediumAttack: 3, heavyAttack: 1 },
    'Level 2 Laser Turret': { cost: 1200, powerLevelBoost: 1.2, lightAttack: 5.5, mediumAttack: 3, heavyAttack: 1 },
    'Level 3 Laser Turret': { cost: 1400, powerLevelBoost: 1.4, lightAttack: 6.0, mediumAttack: 3.5, heavyAttack: 1 },
    // Add more weapons as needed
};
