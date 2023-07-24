function createDateId() {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${month}-${day}-${year % 100}`
}

module.exports = createDateId