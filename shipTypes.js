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
// type, Silhouette. Power Level. Cost. Hull Points. ShieldArmor Points.
var shipTypes = {
    'None': new ShipType('None', 0, 0, 0, 0, 0),
    'Interceptors': new ShipType('Interceptors', 3, 2, 32000, 10, 3),
    'Fighters': new ShipType('Fighters', 3, 2, 36000, 15, 4),
    'Bombers': new ShipType('Bombers', 3, 4, 60000, 20, 5),
    'Heavy Fighters': new ShipType('Heavy Fighters', 4, 4, 12000, 20, 4),
    'Patrol Craft': new ShipType('Patrol Craft', 4, 4, 88000, 35, 6),
    'Shuttles': new ShipType('Shuttles', 4, 4, 52000, 40, 6),
    'Corvettes': new ShipType('Corvettes', 5, 16, 640000, 90, 10),
    'Frigates': new ShipType('Frigates', 6, 32, 4000000, 100, 10),
    'Heavy Cruisers': new ShipType('Heavy Cruisers', 7, 64, 16000000, 150, 10),
    'Destroyers': new ShipType('Destroyers', 8, 128, 48000000, 200, 15),
    'Dreadnoughts': new ShipType('Dreadnoughts', 9, 256, 200000000, 300, 20),
    'Super Star Destroyers': new ShipType('Super Star Destroyers', 10, 512, 1200000000, 500, 25),
    'Small Moons': new ShipType('Small Moons', 11, 1536, 800000000000, 1000, 50),
    'Light Civilian Transports': new ShipType('Light Civilian Transports', 4, 1, 40000, 40, 6),
    'Bulk Freighters': new ShipType('Bulk Freighters', 5, 2, 120000, 60, 6),
    'Heavy Bulk Freighters': new ShipType('Heavy Bulk Freighters', 7, 3, 160000, 60, 6),
    'Yatchts': new ShipType('Yatchts', 4, 1, 72000, 20, 15),
    'Liners': new ShipType('Liners', 5, 2, 16000000, 60, 6),
    'Utility vessels': new ShipType('Utility vessels', 4, 1, 160000, 60, 6),
    'Anti-Capital Mines': new ShipType('Anti-Capital Mines', 2, 1, 1600, 1, 0),
};

export { ShipType, shipTypes };



