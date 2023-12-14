function createDateId() {
    const date = new Date()
    const newDate = date.toLocaleString('en-US', {
        timeZone : "Asia/Manila",
        year : "2-digit",
        month : "2-digit",
        day : "numeric",
    })
    const dateArray = newDate.split("/")
    const day = dateArray[1]
    const month = dateArray[0]
    const year = dateArray[2]
    return `${month}-${day}-${year}`
}

module.exports = createDateId