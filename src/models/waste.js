class Waste {
    constructor(
        id,
        location,
        food_waste,
        hazardous_waste,
        recyclable,
        residual
    ) {
        this.id = id,
        this.location = location,
        this.food_waste = food_waste,
        this.hazardous_waste = hazardous_waste,
        this.recyclable = recyclable,
        this.residual = residual
    }
    
}

module.exports = Waste