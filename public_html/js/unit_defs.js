var UNIT_DEFS = [
    {
        name: "Footman",
        rMin: 1,
        rMax: 1,
        attack: 4,
        defense: 1,
        cost: 2,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Swordman",
        rMin: 1,
        rMax: 1,
        attack: 5,
        defense: 2,
        cost: 3,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Shieldman",
        rMin: 1,
        rMax: 1,
        attack: 4,
        defense: 4,
        cost: 4,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Halberdier",
        rMin: 1,
        rMax: 1,
        attack: 6,
        defense: 0,
        cost: 4,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Pikemen",
        rMin: 1,
        rMax: 1,
        attack: 5,
        defense: 0,
        cost: 5,
        moveCost: [
            3, // plains
            5, // forest
            99, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Archers",
        rMin: 2,
        rMax: 4,
        attack: 3,
        defense: 0,
        cost: 3,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Crossbowmen",
        rMin: 2,
        rMax: 4,
        attack: 4,
        defense: 1,
        cost: 4,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Musketeer",
        rMin: 2,
        rMax: 5,
        attack: 5,
        defense: 0,
        cost: 5,
        moveCost: [
            3, // plains
            5, // forest
            99, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Elves",
        rMin: 1,
        rMax: 2,
        attack: 4,
        defense: 0,
        cost: 5,
        moveCost: [
            3, // plains
            3, // forest
            5, // water
            5, // mountains
            99, // prison
            3, // road
            10, // pit
            10, // cliff
            10, // tower
            10, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Cavalry",
        rMin: 1,
        rMax: 1,
        attack: 4,
        defense: 1,
        cost: 4,
        moveCost: [
            2, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            2, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "snd_horsemove",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Knights",
        rMin: 1,
        rMax: 1,
        attack: 5,
        defense: 3,
        cost: 6,
        moveCost: [
            2, // plains
            5, // forest
            10, // water
            99, // mountains
            99, // prison
            2, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            10, // gate
            4   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Ballista",
        rMin: 2,
        rMax: 4,
        attack: 5,
        defense: 0,
        cost: 6,
        moveCost: [
            5, // plains
            10, // forest
            99, // water
            99, // mountains
            99, // prison
            3, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            10, // gate
            99   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Trebuchet",
        rMin: 3,
        rMax: 5,
        attack: 6,
        defense: 0,
        cost: 8,
        moveCost: [
            5, // plains
            10, // forest
            99, // water
            99, // mountains
            99, // prison
            3, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            10, // gate
            99   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Cannon",
        rMin: 2,
        rMax: 6,
        attack: 7,
        defense: 0,
        cost: 9,
        moveCost: [
            5, // plains
            10, // forest
            99, // water
            99, // mountains
            99, // prison
            3, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            10, // gate
            99   // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Vulture",
        rMin: 1,
        rMax: 1,
        attack: 4,
        defense: 0,
        cost: 3,
        moveCost: [
            3, // plains
            3, // forest
            3, // water
            3, // mountains
            3, // prison
            3, // road
            3, // pit
            3, // cliff
            3, // tower
            3, // wall
            3, // gate
            3  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Eagle",
        rMin: 1,
        rMax: 1,
        attack: 5,
        defense: 1,
        cost: 5,
        moveCost: [
            2, // plains
            2, // forest
            2, // water
            2, // mountains
            2, // prison
            2, // road
            2, // pit
            2, // cliff
            2, // tower
            2, // wall
            2, // gate
            2  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Dragon",
        rMin: 1,
        rMax: 2,
        attack: 7,
        defense: 3,
        cost: 8,
        moveCost: [
            2, // plains
            2, // forest
            2, // water
            2, // mountains
            2, // prison
            2, // road
            2, // pit
            2, // cliff
            2, // tower
            2, // wall
            2, // gate
            2  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Ogre",
        rMin: 1,
        rMax: 1,
        attack: 9,
        defense: 7,
        cost: 12,
        moveCost: [
            5, // plains
            10, // forest
            99, // water
            10, // mountains
            99, // prison
            5, // road
            10, // pit
            10, // cliff
            10, // tower
            10, // wall
            10, // gate
            99  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Lord",
        rMin: 1,
        rMax: 1,
        attack: 6,
        defense: 1,
        cost: 7,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Wizard",
        rMin: 1,
        rMax: 5,
        attack: 5,
        defense: 0,
        cost: 8,
        moveCost: [
            3, // plains
            3, // forest
            3, // water
            3, // mountains
            3, // prison
            3, // road
            3, // pit
            3, // cliff
            3, // tower
            3, // wall
            3, // gate
            3  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Serpent",
        rMin: 1,
        rMax: 2,
        attack: 6,
        defense: 5,
        cost: 8,
        moveCost: [
            99, // plains
            99, // forest
            3, // water
            99, // mountains
            99, // prison
            99, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            99, // gate
            99 // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Zombie",
        rMax: 1,
        attack: 4,
        defense: 1,
        cost: 5,
        moveCost: [
            3, // plains
            5, // forest
            5, // water
            10, // mountains
            99, // prison
            5, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            99  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Necromancer",
        rMin: 1,
        rMax: 3,
        attack: 5,
        defense: 1,
        cost: 8,
        moveCost: [
            3, // plains
            3, // forest
            3, // water
            3, // mountains
            3, // prison
            3, // road
            99, // pit
            99, // cliff
            3, // tower
            3, // wall
            3, // gate
            3  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Medic",
        rMin: 1,
        rMax: 1,
        attack: 0,
        defense: 0,
        cost: 8,
        moveCost: [
            3, // plains
            5, // forest
            10, // water
            10, // mountains
            99, // prison
            3, // road
            10, // pit
            99, // cliff
            10, // tower
            10, // wall
            10, // gate
            4  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    },
    {
        name: "Hydra",
        rMin: 1,
        rMax: 1,
        attack: 8,
        defense: 4,
        cost: 10,
        moveCost: [
            3, // plains
            3, // forest
            3, // water
            3, // mountains
            99, // prison
            3, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            99, // gate
            99  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: true
    },
    {
        name: "Dark Majesty",
        rMin: 1,
        rMax: 10,
        attack: 5,
        defense: 4,
        cost: 14,
        moveCost: [
            99, // plains
            99, // forest
            99, // water
            99, // mountains
            99, // prison
            99, // road
            99, // pit
            99, // cliff
            99, // tower
            99, // wall
            99, // gate
            99  // house            
        ],
        moveSound: "walk.mp3",
        attack_sound: "attack.mp3",
        attackAfterMove: false
    }
];
