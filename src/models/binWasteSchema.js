const { serverTimestamp } = require("firebase/firestore");

class BinDataModel {
  constructor(capacity, type, frequency, trashbin, timestamp) {
    this.capacity = capacity,
    this.type = type,
    this.frequency = frequency,
    this.trashbin = trashbin,
    this.timestamp = timestamp
  }
  async defaultBinData(trashbin_name, type) {
    return {
      capacity: 0,
      type: type,
      frequency: 0,
      trashbin: trashbin_name,
      timestamp: serverTimestamp()
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