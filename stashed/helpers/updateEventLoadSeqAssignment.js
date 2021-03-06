import findUtcOffsetAirports from './findUtcOffsetAirports'
// import airports from '../data/airports.json'
// import findUtcOffsetAirports from './findUtcOffsetAirports'

// GIVEN EVENTS ARR, EVENTMODEL, MODELID AND UPDATEEVENTOBJ WITH STARTDAY,ENDDAY,STARTTIME,ENDTIME, RETURN CHANGINGLOADSEQUENCE ARR AND UPDATEEVENTOBJ WITH LOAD SEQ.

// updateEventObj = {
//   startDay,
//   endDay,
//   startTime,
//   endTime,
//   utcOffset, // for activity, food, lodging
//   departureUtcOffset, arrivalUtcOffset // transport
//   departureIATA, arrivalIATA // flights
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
  // console.log('updateEventObj', updateEvent)

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
    // console.log('is flight')
    updateEvent = updateEvent.map(instance => {
      var startUtcOffset = findUtcOffsetAirports(instance.departureIATA)
      var endUtcOffset = findUtcOffsetAirports(instance.arrivalIATA)
      // console.log('utc offsets', startUtcOffset, endUtcOffset)
      instance.startTimeUtcZero = instance.startTime - (startUtcOffset * 60)
      instance.endTimeUtcZero = instance.endTime - (endUtcOffset * 60)
      var instanceWithUtc = instance
      return instanceWithUtc
    })
  }

  // console.log('updateEventObj with timeUtcZero', updateEvent)

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
    // console.log('dayevents', dayEvents)
    // console.log('updateEventObj', updateEvent)
    var displacedRow = dayEvents.find(e => {
      if (typeof (updateEvent.startTime) === 'number') {
        return (e.timeUtcZero >= updateEvent.startTimeUtcZero)
      } else {
        return null
      }
    })
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
      // console.log('inserted', dayEvents)
    }
    dayEvents.forEach(event => {
      var correctLoadSeq = dayEvents.indexOf(event) + 1
      if (event.modelId && event.loadSequence !== correctLoadSeq) {
        var inputObj = constructLoadSeqInputObj(event, correctLoadSeq)
        // console.log('INPUT OBJ', inputObj)
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
            return (event.timeUtcZero >= updateEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

        // console.log('type', type, 'displacedRow', displacedRow)
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
      // console.log('after inserting 2', dayEvents)

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
            return (event.timeUtcZero >= updateEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

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
    // console.log('updates arr', updateEvent)

    updateEvent.forEach(instance => {
      // console.log('instance', instance)
      flightInstanceRows.push(
        {day: instance.startDay, timeUtcZero: instance.startTimeUtcZero},
        {day: instance.endDay, timeUtcZero: instance.endTimeUtcZero}
      )
      if (!days.includes(instance.startDay)) {
        days.push(instance.startDay)
      }
      if (!days.includes(instance.endDay)) {
        days.push(instance.endDay)
      }
    })
    // console.log('flightinstance rows', flightInstanceRows)
    // console.log('days', days)
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
      // console.log('dayInstanceRows', dayInstanceRows)
      dayInstanceRows.forEach(instanceRow => {
        // console.log('inserting for 1 instanceRow', instanceRow)
        var displacedRow = dayEvents.find(e => {
          return (e.timeUtcZero >= instanceRow.timeUtcZero)
        })
        if (!displacedRow) {
          dayEvents.push(instanceRow)
        } else {
          // console.log('instanceRow time', instanceRow.time, 'displacedRow', displacedRow.time)
          var index = dayEvents.indexOf(displacedRow)
          if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === instanceRow.timeUtcZero) {
            dayEvents.splice(index + 1, 0, instanceRow)
          } else if (displacedRow.timeUtcZero === instanceRow.timeUtcZero && displacedRow.type === 'Lodging') {
            dayEvents.splice(index + 1, 0, instanceRow)
          } else {
            dayEvents.splice(index, 0, instanceRow)
          }
        }
      })

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
