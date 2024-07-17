class ShipType {
    constructor(name, silhouette = 1, powerLevel = 1, baseCost = 0) {
        this.name = name;
        this.silhouette = silhouette;
        this.powerLevel = powerLevel;
        this.baseCost = baseCost;
    }
}
// type, Silhouette. Power Level. Cost. 
var shipTypes = {
    'None': new ShipType('None', 0, 0, 0),
    'Interceptors': new ShipType('Interceptors', 3, 2, 32000),
    'Fighters': new ShipType('Fighters', 3, 2, 36000),
    'Bombers': new ShipType('Bombers', 3, 4, 60000),
    'Corvettes': new ShipType('Corvettes', 5, 16, 640000),
    'Frigates': new ShipType('Frigates', 6, 32, 4000000),
    'Heavy Cruisers': new ShipType('Heavy Cruisers', 7, 64, 16000000),
    'Destroyers': new ShipType('Destroyers', 8, 128, 48000000),
    'Dreadnoughts': new ShipType('Dreadnoughts', 9, 256, 200000000),
    'Super Star Destroyers': new ShipType('Super Star Destroyers', 10, 512, 1200000000),
    'Small Moons': new ShipType('Small Moons', 11, 1536, 800000000000),
    'Civilian craft': new ShipType('Civilian craft', 0, 0, 0),
    'Light Civilian Transports': new ShipType('Light Civilian Transports', 4, 1, 40000),
    'Bulk Freighters': new ShipType('Bulk Freighters', 5, 2, 120000),
    'Heavy Bulk Freighters': new ShipType('Heavy Bulk Freighters', 7, 3, 160000),
    'Yatchts': new ShipType('Yatchts', 4, 1, 72000),
    'Liners': new ShipType('Liners', 5, 2, 16000000),
    'Utility vessels': new ShipType('Utility vessels', 4, 1, 160000),
    'Anti-Capital Mines': new ShipType('Anti-Capital Mines', 2, 1, 1600),
    'Super Star Destroyer Hull Component': new ShipType('Super Star Destroyer Hull Component', 10, 0, 600000000),
    'Super Star Destroyer Engine Component': new ShipType('Super Star Destroyer Engine Component', 10, 0, 600000000),
    'Destroyer front Hull (Part 1)': new ShipType('Destroyer front Hull (Part 1)', 4, 0, 24000000),
    'Destroyer Engine Package (Part 2)': new ShipType('Destroyer Engine Package (Part 2)', 4, 0, 24000000),
    'REPAIRS/UPGRADES Corvettes': new ShipType('REPAIRS/UPGRADES Corvettes', 5, 0, 1),
    'REPAIRS/UPGRADES Frigates': new ShipType('REPAIRS/UPGRADES Frigates', 6, 0, 1),
    'REPAIRS/UPGRADES Heavy Cruiser': new ShipType('REPAIRS/UPGRADES Heavy Cruiser', 7, 0, 1),
    'REPAIRS/UPGRADES Destroyer': new ShipType('REPAIRS/UPGRADES Destroyer', 8, 0, 1),
    'REPAIRS/UPGRADES Dreadnoughts': new ShipType('REPAIRS/UPGRADES Dreadnoughts', 9, 0, 1),
    'REPAIRS/UPGRADES Super Star Destroyers': new ShipType('REPAIRS/UPGRADES Super Star Destroyers', 10, 0, 1),
    'REPAIRS/UPGRADES Small Moons': new ShipType('REPAIRS/UPGRADES Small Moons', 11, 0, 1),
    'Shipyard Upgrade parts': new ShipType('Shipyard Upgrade parts', 1, 0, 2000000),
    'Heavy Fighters': new ShipType('Heavy Fighters', 4, 4, 12000),
    'Patrol Craft': new ShipType('Patrol Craft', 4, 4, 88000),
    'Shuttles': new ShipType('Shuttles', 4, 4, 52000)
};

export { ShipType, shipTypes };
