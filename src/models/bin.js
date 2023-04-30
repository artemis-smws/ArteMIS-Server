class Bin {
    constructor(
        id,
        latitude,
        longitude,
        timestamp,
        capacity,
        type
    ) {
        this.id = id
        this.latitude = latitude
        this.longitude = longitude
        this.timestamp = timestamp
        this.capacity = capacity
        this.type = type
    }
}

module.exports = Bin