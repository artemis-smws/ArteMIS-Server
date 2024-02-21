class BinDataModel {
  constructor(capacity, type, frequency, trashbin, timestamp) {
    this.capacity = capacity,
    this.type = type,
    this.frequency = frequency,
    this.trashbin = trashbin,
    this.timestamp = timestamp
  }
  async defaultBinData(trashbin_name) {
    return {
      capacity: 0,
      type: "",
      frequency: 0,
      trashbin: trashbin_name,
      timestamp: ""
    }
  }
  async getBinData() {
    return this.binData;
  }

  async addBinData(data) {
    this.binData.push(data);
  }
}

module.exports = BinDataModel