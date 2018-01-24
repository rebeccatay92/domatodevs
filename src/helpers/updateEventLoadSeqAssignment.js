import airports from '../data/airports.json'
// GIVEN EVENTS ARR, EVENTMODEL, MODELID AND UPDATEEVENTOBJ WITH STARTDAY,ENDDAY,STARTTIME,ENDTIME, RETURN CHANGINGLOADSEQUENCE ARR AND UPDATEEVENTOBJ WITH LOAD SEQ.

// updateEventObj = {
//   startDay,
//   endDay,
//   startTime,
//   endTime,
//   utcOffset, // for activity, food, lodging
//   departureUtcOffset, // transport
//   arrivalUtcOffset,
//   departureIATA, // flight instances
//   arrivalIATA
// }

function constructLoadSeqInputObj (event, correctLoadSeq) {
  var inputObj = {
    type: event.type === 'Flight' ? 'FlightInstance' : event.type,
    id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
    loadSequence: correctLoadSeq,
    day: event.day
  }
  if (event.type === 'Flight' || event.type === 'LandTransport' || event.type === 'SeaTransport' || event.type === 'Train' || event.type === 'Lodging') {
    inputObj.start = event.start
  }
  return inputObj
}

function checkIfEndingRow (event) {
  return (typeof (event.start) === 'boolean' && !event.start && event.type !== 'Lodging')
}

function findUtcOffsetAirports (iata) {
  var airportRow = airports.find(row => {
    return row.iata === iata
  })
  var utcInMinutes = airportRow.timezone * 60
  return utcInMinutes
}

function updateEventLoadSeqAssignment (eventsArr, eventModel, modelId, updateEvent) {
  var loadSequenceInput = []

  // affectedDays are days where event is deleted, but not equal to day where event is reinserted. ie -> event moves from day 1 to day 2. day 1 is affected, day 2 is not.
  var affectedDays = []

  // remove old event and find all affected days
  var allEvents = eventsArr.filter(e => {
    if (e.type === eventModel && e.modelId === modelId) {
      if (!affectedDays.includes(e.day)) {
        affectedDays.push(e.day)
      }
    } else {
      return e
    }
  })

  // TACK ON LOCATION UTCOFFSET FOR EVENTS ARR
  allEvents = allEvents.map(eventRow => {
    var type = eventRow.type
    var eventRowWithUtc = null
    if (type === 'Activity' || type === 'Food' || type === 'Lodging') {
      eventRow.utcOffset = eventRow[`${type}`].location.utcOffset
      eventRow.timeUtcZero = eventRow.time - (eventRow.utcOffset * 60)
      eventRowWithUtc = eventRow
    }
    if (type === 'LandTransport' || type === 'SeaTransport' || type === 'Train') {
      eventRow.utcOffset = eventRow.start ? eventRow[`${type}`].departureLocation.utcOffset : eventRow[`${type}`].arrivalLocation.utcOffset
      eventRow.timeUtcZero = eventRow.time - (eventRow.utcOffset * 60)
      eventRowWithUtc = eventRow
    }
    if (type === 'Flight') {
      eventRow.utcOffset = eventRow.start ? eventRow.Flight.FlightInstance.departureLocation.utcOffset : eventRow.Flight.FlightInstance.arrivalLocation.utcOffset
      eventRowWithUtc = eventRow
      eventRow.timeUtcZero = eventRow.time - (eventRow.utcOffset * 60)
    }
    return eventRowWithUtc
  })
  console.log('after adding utc offset and utcTimeZero to eventsArr', allEvents)

  // add timeUtcZero to updateEvent
  // console.log('before calculating utcTimeZero', updateEvent)
  if (eventModel === 'Activity' || eventModel === 'Food' || eventModel === 'Lodging') {
    updateEvent.startTimeUtcZero = updateEvent.startTime - (updateEvent.utcOffset * 60)
    updateEvent.endTimeUtcZero = updateEvent.endTime - (updateEvent.utcOffset * 60)
  }
  if (eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    updateEvent.startTimeUtcZero = updateEvent.startTime - (updateEvent.departureUtcOffset * 60)
    updateEvent.endTimeUtcZero = updateEvent.endTime - (updateEvent.arrivalUtcOffset * 60)
  }
  if (eventModel === 'Flight') {
    updateEvent = updateEvent.map(instance => {
      var startUtcOffset = findUtcOffsetAirports(instance.departureIATA)
      var endUtcOffset = findUtcOffsetAirports(instance.arrivalIATA)
      instance.startTimeUtcZero = instance.startTime - (startUtcOffset * 60)
      instance.endTimeUtcZero = instance.endTime - (endUtcOffset * 60)
      var instanceWithUtc = instance
      return instanceWithUtc
    })
  }

  console.log('updateEventObj with timeUtcZero', updateEvent)

  // reassign load seqs etc
  if (eventModel === 'Activity' || eventModel === 'Food') {
    // affectedDays are delete only days. remove days where event needs to be reinserted
    affectedDays = affectedDays.filter(e => {
      return e !== updateEvent.startDay
    })

    // find day to reinsert, then find displacedRow
    var dayEvents = allEvents.filter(e => {
      return e.day === updateEvent.startDay
    })
    console.log('dayevents', dayEvents)
    console.log('updateEventObj', updateEvent)
    var displacedRow = dayEvents.find(e => {
      if (typeof (updateEvent.startTime) === 'number') {
        // return (e.time >= updateEvent.startTime)
        return (e.timeUtcZero >= updateEvent.startTimeUtcZero)
      } else {
        return null
      }
    })

    // if (!displacedRow) {
    //   console.log('NO DISPLACED ROW')
    //   dayEvents.push('placeholder')
    // } else {
    //   var index = dayEvents.indexOf(displacedRow)
    //   console.log('DISPLACED ROW', displacedRow)
    //   if (checkIfEndingRow(displacedRow) && displacedRow.time === updateEvent.startTime) {
    //     dayEvents.splice(index + 1, 0, 'placeholder')
    //   } else if (displacedRow.time === updateEvent.startTime && displacedRow.type === 'Lodging') {
    //     dayEvents.splice(index + 1, 0, 'placeholder')
    //   } else {
    //     dayEvents.splice(index, 0, 'placeholder')
    //   }
    //   console.log('inserted', dayEvents)
    // }
    if (!displacedRow) {
      dayEvents.push('placeholder')
    } else {
      var index = dayEvents.indexOf(displacedRow)
      if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === updateEvent.startTimeUtcZero) {
        dayEvents.splice(index + 1, 0, 'placeholder')
      } else if (displacedRow.timeUtcZero === updateEvent.startTimeUtcZero && displacedRow.type === 'Lodging') {
        dayEvents.splice(index + 1, 0, 'placeholder')
      } else {
        dayEvents.splice(index, 0, 'placeholder')
      }
      console.log('inserted', dayEvents)
    }
    dayEvents.forEach(event => {
      var correctLoadSeq = dayEvents.indexOf(event) + 1
      if (event.modelId && event.loadSequence !== correctLoadSeq) {
        var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
        console.log('INPUT OBJ', inputObj)
        loadSequenceInput.push(inputObj)
      } else if (event === 'placeholder') {
        updateEvent.loadSequence = correctLoadSeq
      }
    })

    // change load seq for affectedDays (days where event was removed only)
    affectedDays.forEach(day => {
      dayEvents = allEvents.filter(e => {
        return e.day === day
      })
      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        }
        // wont hv placeholder since affectedDays is for days with delete only
      })
    })
  }
  if (eventModel === 'Lodging' || eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    // remove days where event is to be reinserted
    affectedDays = affectedDays.filter(e => {
      return (e !== updateEvent.startDay && e !== updateEvent.endDay)
    })
    if (updateEvent.startDay === updateEvent.endDay) {
      // same day
      dayEvents = allEvents.filter(e => {
        return e.day === updateEvent.startDay
      })
      var types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start') // true or false

        var displacedRow = dayEvents.find(event => {
          if (typeof (updateEvent[`${type}Time`]) === 'number') {
            // return (event.time >= updateEvent[`${type}Time`])
            return (event.timeUtcZero >= updateEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

        console.log('type', type, 'displacedRow', displacedRow)
        // if (!displacedRow) {
        //   dayEvents.push({start: isStart})
        // } else {
        //   index = dayEvents.indexOf(displacedRow)
        //   if (checkIfEndingRow(displacedRow) && displacedRow.time === updateEvent[`${type}Time`]) {
        //     dayEvents.splice(index + 1, 0, {start: isStart})
        //   } else if (displacedRow.time === updateEvent[`${type}Time`] && displacedRow.type === 'Lodging') {
        //     dayEvents.splice(index + 1, 0, {start: isStart})
        //   } else {
        //     dayEvents.splice(index, 0, {start: isStart})
        //   }
        // }
        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === updateEvent[`${type}TimeUtcZero`]) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else if (displacedRow.timeUtcZero === updateEvent[`${type}TimeUtcZero`] && displacedRow.type === 'Lodging') {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else {
            dayEvents.splice(index, 0, {start: isStart})
          }
        }
      })
      console.log('after inserting 2', dayEvents)

      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        } else if (!event.modelId && event.start) {
          updateEvent.startLoadSequence = correctLoadSeq
        } else if (!event.modelId && !event.start) {
          updateEvent.endLoadSequence = correctLoadSeq
        }
      })
    } else {
      // different start and end day
      types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start')
        dayEvents = allEvents.filter(e => {
          return isStart ? (e.day === updateEvent.startDay) : (e.day === updateEvent.endDay)
        })

        var displacedRow = dayEvents.find(event => {
          if (typeof (updateEvent[`${type}Time`]) === 'number') {
            // return (event.time >= updateEvent[`${type}Time`])
            return (event.timeUtcZero >= updateEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

        // if (!displacedRow) {
        //   dayEvents.push({start: isStart})
        // } else {
        //   index = dayEvents.indexOf(displacedRow)
        //   if (checkIfEndingRow(displacedRow) && displacedRow.time === updateEvent[`${type}Time`]) {
        //     dayEvents.splice(index + 1, 0, {start: isStart})
        //   } else if (displacedRow.time === updateEvent[`${type}Time`] && displacedRow.type === 'Lodging') {
        //     dayEvents.splice(index + 1, 0, {start: isStart})
        //   } else {
        //     dayEvents.splice(index, 0, {start: isStart})
        //   }
        // }
        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === updateEvent[`${type}TimeUtcZero`]) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else if (displacedRow.timeUtcZero === updateEvent[`${type}TimeUtcZero`] && displacedRow.type === 'Lodging') {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else {
            dayEvents.splice(index, 0, {start: isStart})
          }
        }

        dayEvents.forEach(event => {
          var correctLoadSeq = dayEvents.indexOf(event) + 1
          if (event.modelId && event.loadSequence !== correctLoadSeq) {
            var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
            loadSequenceInput.push(inputObj)
          } else if (!event.modelId) {
            isStart ? (updateEvent.startLoadSequence = correctLoadSeq) : (updateEvent.endLoadSequence = correctLoadSeq)
          }
        })
      })
    }

    // change load seq for affectedDays (days where event was removed only)
    affectedDays.forEach(day => {
      dayEvents = allEvents.filter(e => {
        return e.day === day
      })
      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        }
      })
    })
  }
  if (eventModel === 'Flight') {
    var flightInstanceRows = []
    var days = []

    // reassign seq
    console.log('updates arr', updateEvent)

    updateEvent.forEach(instance => {
      flightInstanceRows.push(
        {day: instance.startDay, time: instance.startTimeUtcZero},
        {day: instance.endDay, time: instance.endTimeUtcZero}
      )
      if (!days.includes(instance.startDay)) {
        days.push(instance.startDay)
      } else if (!days.includes(instance.endDay)) {
        days.push(instance.endDay)
      }
    })
    // if reinsertion, remove days from affectedDays array.
    days.forEach(day => {
      if (affectedDays.includes(day)) {
        affectedDays = affectedDays.filter(e => {
          return e !== day
        })
      }
    })

    // arr for assign start/end load seqs
    var flightInstanceLoadSeqs = []
    days.forEach(day => {
      var dayEvents = allEvents.filter(e => {
        return e.day === day
      })
      var dayInstanceRows = flightInstanceRows.filter(e => {
        return e.day === day
      })
      // inserting entire day's instances as a group,
      var displacedRow = dayEvents.find(e => {
        return (e.timeUtcZero >= dayInstanceRows[0].time)
      })
      if (!displacedRow) {
        dayEvents.push(...dayInstanceRows)
      } else if (displacedRow) {
        var index = dayEvents.indexOf(displacedRow)
        if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === dayInstanceRows[0].time) {
          dayEvents.splice(index + 1, 0, ...dayInstanceRows)
        } else if (displacedRow.timeUtcZero === dayInstanceRows[0].time && displacedRow.type === 'Lodging') {
          dayEvents.splice(index + 1, 0, 'placeholder')
        } else {
          dayEvents.splice(index, 0, ...dayInstanceRows)
        }
      }

      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.modelId && event.loadSequence !== correctLoadSeq) {
          var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInput.push(inputObj)
        } else if (!event.modelId) {
          flightInstanceLoadSeqs.push(correctLoadSeq)
        }
      })

      // assign every two load seqs to arr of flight instances
      for (var i = 0; i < updateEvent.length; i++) {
        updateEvent[i].startLoadSequence = flightInstanceLoadSeqs[(2 * i)]
        updateEvent[i].endLoadSequence = flightInstanceLoadSeqs[(2 * i) + 1]
      }
    })
  } // close flight logic

  // NO NEED TO REMOVE UTCOFFSET KEYS ETC. EDITEVENTFORMS WILL ONLY REMOVE LOAD SEQ PROPERTY FROM UDPATEVENT AND CHANGE THE UPDATESOBJ TO BE SENT TO BACKEND
  var output = {
    updateEvent,
    loadSequenceInput
  }
  return output
}

export default updateEventLoadSeqAssignment
