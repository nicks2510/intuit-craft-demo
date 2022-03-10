export const createDateFromTime = (date, time) => {
  const tm = time.split(':')
  if (Date.parse(date)) {
    const dt = date
    return new Date(
      dt.getFullYear(),
      dt.getMonth(),
      dt.getDate(),
      parseInt(tm[0]),
      parseInt(tm[1])
    )
  } else {
    const dt = date.split('/')
    return new Date(dt[2], dt[1] - 1, dt[0], parseInt(tm[0]), parseInt(tm[1]))
  }
}

const createDateWithoutTime = (date) => {
  if (date.getFullYear) {
    const dt = date
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  } else {
    if (date.split('/').length > 2) {
      const dt = date.split('/')
      return new Date(dt[2], dt[1] - 1, dt[0])
    } else {
      const dt = date.split('-')
      return new Date(dt[0], dt[1] - 1, dt[2])
    }
  }
}
export const dateEquals = (dt1, dt2) => {
  const date1 = createDateWithoutTime(dt1)
  const date2 = createDateWithoutTime(dt2)

  return date1.getTime() === date2.getTime()
}

export const checkIntervalLiesBtwGivenTimes = (startTime, endTime) => {
  let currentDate = new Date()
  let startDate = createDateFromTime(currentDate, startTime)
  let endDate = createDateFromTime(currentDate, endTime)

  return startDate <= currentDate && endDate >= currentDate
}
