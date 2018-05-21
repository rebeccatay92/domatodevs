const _ = require('lodash')

function checkForTimelineErrorsInPlanner (events) {
  let latestUnix = {unix: 0, offset: 0}
  let flightsTransportArr = []
  let validatedEvents = []
  events.forEach((event, i) => {
    // console.log(latestUnix);
    const eventType = event.type
    const eventHasOneRow = eventType !== 'Lodging' && eventType !== 'LandTransport' && eventType !== 'Flight'
    const eventHasTwoRows = !eventHasOneRow
    const eventCannotHaveAnythingInBetween = eventType === 'LandTransport' || eventType === 'Flight'
    // Check for any UTC difference between the two events to be compared
    let utcOffset, utcDiff
    if (!eventCannotHaveAnythingInBetween) {
      const location = event[eventType].location
      if (location) utcOffset = event[eventType].location.utcOffset
      else utcOffset = 'no location'
    } else if (event.start) {
      utcOffset = eventType === 'Flight' ? event[eventType].FlightInstance.departureLocation.utcOffset : event[eventType].departureLocation.utcOffset
    } else if (!event.start) {
      utcOffset = eventType === 'Flight' ? event[eventType].FlightInstance.arrivalLocation.utcOffset : event[eventType].arrivalLocation.utcOffset
    }
    if (i === 0) {
      latestUnix.offset = utcOffset
    }
    if (utcOffset === 'no location') utcDiff = 0
    else utcDiff = (latestUnix.offset - utcOffset) * 60
    // Check for time clash
    let startTime, endTime
    if (eventType === 'Flight') {
      startTime = event[eventType].FlightInstance.startTime + (event[eventType].FlightInstance.startDay - 1) * 86400
      endTime = event[eventType].FlightInstance.endTime + (event[eventType].FlightInstance.endDay - 1) * 86400
    } else {
      startTime = event[eventType].startTime + (event[eventType].startDay - 1) * 86400
      endTime = event[eventType].endTime + (event[eventType].endDay - 1) * 86400
    }
    // For rows that represent the start of an event.
    if (eventHasOneRow || (typeof event.start === 'boolean' ? event.start : true)) {
      if (startTime + utcDiff < latestUnix.unix) {
        validatedEvents[i] = {...event, ...{timelineClash: true}}
        if (i > 0) {
          validatedEvents[i - 1] = {...validatedEvents[i - 1], ...{timelineClash: true}}
        }
      } else {
        validatedEvents[i] = {...event, ...{timelineClash: false}}
      }
      if (eventHasOneRow && endTime + utcDiff > latestUnix.unix) latestUnix = {unix: endTime, offset: utcOffset === 'no location' ? latestUnix.offset : utcOffset}
      else if (eventHasTwoRows && startTime + utcDiff > latestUnix.unix) latestUnix = {unix: startTime, offset: utcOffset === 'no location' ? latestUnix.offset : utcOffset}
      // for rows that represent the end of a lodging/flight/transport.
    } else {
      if (endTime + utcDiff < latestUnix.unix) {
        validatedEvents[i] = {...event, ...{timelineClash: true}}
        if (i > 0) {
          validatedEvents[i - 1] = {...validatedEvents[i - 1], ...{timelineClash: true}}
        }
      } else {
        validatedEvents[i] = {...event, ...{timelineClash: false}}
      }
      if (endTime + utcDiff > latestUnix.unix) latestUnix = {unix: endTime, offset: utcOffset === 'no location' ? latestUnix.offset : utcOffset}
    }

    // Check for events between flights/transport start and end rows
    const id = eventType === 'Flight' ? event[eventType].FlightInstance.id : event[eventType].id
    const obj = {
      type: eventType,
      id: id
    }
    if (eventCannotHaveAnythingInBetween) {
      if (_.some(flightsTransportArr, obj)) {
        flightsTransportArr = flightsTransportArr.filter(event => !_.isEqual(obj, event))
      } else {
        flightsTransportArr.push(obj)
      }
    }
    if (flightsTransportArr.length > 0 && !_.some(flightsTransportArr, obj)) {
      validatedEvents[i] = {...validatedEvents[i], ...{inBetweenStartEndRow: true}}
    } else {
      validatedEvents[i] = {...validatedEvents[i], ...{inBetweenStartEndRow: false}}
    }
  })
  return validatedEvents
}

export default checkForTimelineErrorsInPlanner
