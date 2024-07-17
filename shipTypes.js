class ShipType {
    constructor(name, silhouette = 1, powerLevel = 1, baseCost = 0, hullPoints = 0, shieldArmorPoints = 0) {
        this.name = name;
        this.silhouette = silhouette;
        this.powerLevel = powerLevel;
        this.baseCost = baseCost;
        this.hullPoints = hullPoints;
        this.shieldArmorPoints = shieldArmorPoints;
    }
}
// type, Silhouette. Power Level. Cost. 
var shipTypes = {
    'None': new ShipType('None', 0, 0, 0, 0, 0),
    'Interceptors': new ShipType('Interceptors', 3, 2, 32000, 500, 500),
    'Fighters': new ShipType('Fighters', 3, 2, 36000, 10, 10),
    'Bombers': new ShipType('Bombers', 3, 4, 60000, 0, 0),
    'Corvettes': new ShipType('Corvettes', 5, 16, 640000, 0, 0),
    'Frigates': new ShipType('Frigates', 6, 32, 4000000, 0, 0),
    'Heavy Cruisers': new ShipType('Heavy Cruisers', 7, 64, 16000000, 0, 0),
    'Destroyers': new ShipType('Destroyers', 8, 128, 48000000, 0, 0),
    'Dreadnoughts': new ShipType('Dreadnoughts', 9, 256, 200000000, 0, 0),
    'Super Star Destroyers': new ShipType('Super Star Destroyers', 10, 512, 1200000000, 0, 0),
    'Small Moons': new ShipType('Small Moons', 11, 1536, 800000000000, 0, 0),
    'Civilian craft': new ShipType('Civilian craft', 0, 0, 0),
    'Light Civilian Transports': new ShipType('Light Civilian Transports', 4, 1, 40000, 0, 0),
    'Bulk Freighters': new ShipType('Bulk Freighters', 5, 2, 120000, 0, 0),
    'Heavy Bulk Freighters': new ShipType('Heavy Bulk Freighters', 7, 3, 160000, 0, 0),
    'Yatchts': new ShipType('Yatchts', 4, 1, 72000, 0, 0),
    'Liners': new ShipType('Liners', 5, 2, 16000000, 0, 0),
    'Utility vessels': new ShipType('Utility vessels', 4, 1, 160000, 0, 0),
    'Anti-Capital Mines': new ShipType('Anti-Capital Mines', 2, 1, 1600, 0, 0),
    'Super Star Destroyer Hull Component': new ShipType('Super Star Destroyer Hull Component', 10, 0, 600000000, 0, 0),
    'Super Star Destroyer Engine Component': new ShipType('Super Star Destroyer Engine Component', 10, 0, 600000000, 0, 0),
    'Destroyer front Hull (Part 1)': new ShipType('Destroyer front Hull (Part 1)', 4, 0, 24000000, 0, 0),
    'Destroyer Engine Package (Part 2)': new ShipType('Destroyer Engine Package (Part 2)', 4, 0, 24000000, 0, 0),
    'REPAIRS/UPGRADES Corvettes': new ShipType('REPAIRS/UPGRADES Corvettes', 5, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Frigates': new ShipType('REPAIRS/UPGRADES Frigates', 6, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Heavy Cruiser': new ShipType('REPAIRS/UPGRADES Heavy Cruiser', 7, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Destroyer': new ShipType('REPAIRS/UPGRADES Destroyer', 8, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Dreadnoughts': new ShipType('REPAIRS/UPGRADES Dreadnoughts', 9, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Super Star Destroyers': new ShipType('REPAIRS/UPGRADES Super Star Destroyers', 10, 0, 1, 0, 0),
    'REPAIRS/UPGRADES Small Moons': new ShipType('REPAIRS/UPGRADES Small Moons', 11, 0, 1, 0, 0),
    'Shipyard Upgrade parts': new ShipType('Shipyard Upgrade parts', 1, 0, 2000000, 0, 0),
    'Heavy Fighters': new ShipType('Heavy Fighters', 4, 4, 12000, 0, 0),
    'Patrol Craft': new ShipType('Patrol Craft', 4, 4, 88000, 0, 0),
    'Shuttles': new ShipType('Shuttles', 4, 4, 52000, 0, 0)
};

export { ShipType, shipTypes };
