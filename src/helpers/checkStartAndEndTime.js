// If the event does not have a startTime or endTime, this function will give the event a default endTime or startTime respectively. Eg. A event with 8pm start time but no end time, will have a 10pm end time if the events schedule in that day is: Food: 6pm - 8pm, Movie: 10pm-12am

function checkStartAndEndTime (eventsArr, event, type) {
  // console.log('eventsArr', eventsArr)
  // console.log('event', event)
  // console.log('type', type)

  const eventsInDay = eventsArr.filter(e => e.day === event.startDay)
  console.log('eventsInDay', eventsInDay)

  if (type === 'startTimeMissing') {
    let index = eventsInDay.findIndex(e => {
      return e.time >= event.endTime
    })
    if (index === -1) index = eventsInDay.length
    if (index === 0) event.startTime = 0
    else {
      event.startTime = eventsInDay[index - 1].type === 'Lodging' && eventsInDay[index - 1].start ? eventsInDay[index - 1][eventsInDay[index - 1].type].startTime : eventsInDay[index - 1][eventsInDay[index - 1].type].endTime
    }
  } else if (type === 'endTimeMissing') {
    let index = eventsInDay.findIndex(e => {
      return e.time >= event.startTime
    })
    if (index === -1) event.endTime = 86400
    else {
      event.endTime = eventsInDay[index].type === 'Lodging' && !eventsInDay[index].start ? eventsInDay[index][eventsInDay[index].type].endTime : eventsInDay[index][eventsInDay[index].type].startTime
    }
  } else if (type === 'allDayEvent') {
    event.allDayEvent = true
    if (eventsInDay.length === 0) {
      event.startTime = 86400
      event.endTime = 86400
    } else if (eventsInDay[eventsInDay.length - 1][eventsInDay[eventsInDay.length - 1].type].startDay < eventsInDay[eventsInDay.length - 1][eventsInDay[eventsInDay.length - 1].type].endDay && eventsInDay[eventsInDay.length - 1].type !== 'Lodging') {
      event.startTime = eventsInDay[eventsInDay.length - 1][eventsInDay[eventsInDay.length - 1].type].startTime
      event.endTime = event.startTime
    } else {
      event.startTime = 86400
      event.endTime = 86400
    }
  }
  console.log('EVENT IN HELPER', event)
  return event
}

export default checkStartAndEndTime
