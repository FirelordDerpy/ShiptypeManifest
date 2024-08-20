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
    'Level 1 Secondary Turrets': { cost: 100, powerLevelBoost: 1.5, lightAttack: 6, mediumAttack: 6, heavyAttack: 2 },
    // Add more weapons as needed
};
