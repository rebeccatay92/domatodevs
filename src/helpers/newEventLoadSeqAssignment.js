/*
WHAT THIS DOES:
Returns newEventObjs with loadseq assigned, also returns changingLoadSequence input array

REQUIRED ARGUMENTS:
1) eventsArr from queryItinerary
2) eventModel ('Activity', 'Food', 'Lodging', 'Transport', 'FlightInstance')
3) new obj / array of new objs containing the newEvents that need to be assigned start/end load sequences
REQUIRED STARTDAY, ENDDAY, STARTTIME, ENDTIME, UTCOFFSET (MAY BE DEPARTURE/ARRIVAL)
eg: newActivity {startDay: 1, startTime: 32000}
eg: [{newFLightInstance}, {newFLightInstance}]
*/

// find insertion index
// insert newEvent into dayEvents arr, then compare index with load seq

// helpers for load seq assignment
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

// check displaced row is not an ending row, and if ending row is not of type lodging
function checkIfEndingRow (event) {
  return (typeof (event.start) === 'boolean' && !event.start && event.type !== 'Lodging')
}

function newEventLoadSeqAssignment (eventsArr, eventModel, newEvent) {
  var allEvents = JSON.parse(JSON.stringify(eventsArr))
  // for changing load seq of existing events
  var loadSequenceInput = []
  console.log('allEvents', allEvents, 'newEvent', newEvent)

  // add utc corrected times to newEvent
  if (eventModel === 'Activity' || eventModel === 'Food' || eventModel === 'Lodging') {
    var utcOffset = newEvent.utcOffset
    newEvent.startTimeUtcZero = newEvent.startTime - (utcOffset * 60)
    newEvent.endTimeUtcZero = newEvent.endTime - (utcOffset * 60)
  }
  if (eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    var startUtcOffset = newEvent.departureUtcOffset
    var endUtcOffset = newEvent.arrivalUtcOffset
    newEvent.startTimeUtcZero = newEvent.startTime - (startUtcOffset * 60)
    newEvent.endTimeUtcZero = newEvent.endTime - (endUtcOffset * 60)
  }
  if (eventModel === 'Flight') {
    newEvent = newEvent.map(instance => {
      var startUtcOffset = instance.departureUtcOffset
      var endUtcOffset = instance.arrivalUtcOffset
      instance.startTimeUtcZero = instance.startTime - (startUtcOffset * 60)
      instance.endTimeUtcZero = instance.endTime - (endUtcOffset * 60)
      var instanceWithUtc = instance
      return instanceWithUtc
    })
  }

  // find load seq
  if (eventModel === 'Activity' || eventModel === 'Food') {
    var dayEvents = allEvents.filter(e => {
      return e.day === newEvent.startDay
    })

    var displacedRow = dayEvents.find(e => {
      if (typeof (newEvent.startTime) === 'number') {
        return (e.timeUtcZero >= newEvent.startTimeUtcZero)
      } else {
        return null
      }
    })

    if (!displacedRow) {
      dayEvents.push('placeholder')
    } else {
      var index = dayEvents.indexOf(displacedRow)

      if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === newEvent.startTimeUtcZero) {
        dayEvents.splice(index + 1, 0, 'placeholder')
      } else if (displacedRow.timeUtcZero === newEvent.startTimeUtcZero && displacedRow.type === 'Lodging') {
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
        loadSequenceInput.push(inputObj)
      } else if (event === 'placeholder') {
        newEvent.loadSequence = correctLoadSeq
      }
    })
  }
  if (eventModel === 'Lodging' || eventModel === 'LandTransport' || eventModel === 'SeaTransport' || eventModel === 'Train') {
    if (newEvent.startDay === newEvent.endDay) {
      dayEvents = allEvents.filter(e => {
        return e.day === newEvent.startDay
      })

      var types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start') // true or false

        var displacedRow = dayEvents.find(event => {
          if (typeof (newEvent[`${type}Time`]) === 'number') {
            return (event.timeUtcZero >= newEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

        console.log('type', type, 'displacedRow', displacedRow)

        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === newEvent[`${type}TimeUtcZero`]) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else if (displacedRow.timeUtcZero === newEvent[`${type}TimeUtcZero`] && displacedRow.type === 'Lodging') {
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
          newEvent.startLoadSequence = correctLoadSeq
        } else if (!event.modelId && !event.start) {
          newEvent.endLoadSequence = correctLoadSeq
        }
      })
    } else {
      // different start and end day
      types = ['start', 'end']
      types.forEach(type => {
        var isStart = (type === 'start')
        dayEvents = allEvents.filter(e => {
          return isStart ? (e.day === newEvent.startDay) : (e.day === newEvent.endDay)
        })

        var displacedRow = dayEvents.find(event => {
          if (typeof (newEvent[`${type}Time`]) === 'number') {
            return (event.timeUtcZero >= newEvent[`${type}TimeUtcZero`])
          } else {
            return null
          }
        })

        if (!displacedRow) {
          dayEvents.push({start: isStart})
        } else {
          index = dayEvents.indexOf(displacedRow)
          if (checkIfEndingRow(displacedRow) && displacedRow.timeUtcZero === newEvent[`${type}TimeUtcZero`]) {
            dayEvents.splice(index + 1, 0, {start: isStart})
          } else if (displacedRow.timeUtcZero === newEvent[`${type}TimeUtcZero`] && displacedRow.type === 'Lodging') {
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
            isStart ? (newEvent.startLoadSequence = correctLoadSeq) : (newEvent.endLoadSequence = correctLoadSeq)
          }
        })
      })
    } // close else for separate days
  }
  if (eventModel === 'Flight') {
    console.log('flight instance arr', newEvent)
    var flightInstanceRows = []
    var days = []
    newEvent.forEach(instance => {
      // flight instance rows replace with start, end time
      // give instance placeholder timeUtcZero so it can be inserted 1 by 1
      flightInstanceRows.push(
        {day: instance.startDay, timeUtcZero: instance.startTimeUtcZero},
        {day: instance.endDay, timeUtcZero: instance.endTimeUtcZero}
      )
      if (!days.includes(instance.startDay)) {
        days.push(instance.startDay)
      } else if (!days.includes(instance.endDay)) {
        days.push(instance.endDay)
      }
    })

    var flightInstanceLoadSeqs = [] // for assigning  start/end loadseq
    days.forEach(day => {
      var dayEvents = allEvents.filter(e => {
        return e.day === day
      })
      var dayInstanceRows = flightInstanceRows.filter(e => {
        return e.day === day
      })

      // inserting each instance individually
      dayInstanceRows.forEach(instanceRow => {
        var displacedRow = dayEvents.find(e => {
          return (e.timeUtcZero >= instanceRow.timeUtcZero)
        })
        if (!displacedRow) {
          dayEvents.push(instanceRow)
        } else {
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
      // after looping through all the days, flightInstanceLoadSeqs and loadSequenceInput should be filled. assign start/end load seq to flightinstances
      for (var i = 0; i < newEvent.length; i++) {
        newEvent[i].startLoadSequence = flightInstanceLoadSeqs[(2 * i)]
        newEvent[i].endLoadSequence = flightInstanceLoadSeqs[(2 * i) + 1]
      }
    })
  }

  // after assigning load seq, remove utcTimings from newEvent
  console.log('newEvent after assigning load seq', newEvent)
  if (eventModel !== 'Flight') {
    var removedUtcEvent = {}
    Object.keys(newEvent).forEach(key => {
      if (key !== 'timeUtcZero' && key !== 'startTimeUtcZero' && key !== 'endTimeUtcZero') {
        removedUtcEvent[key] = newEvent[key]
      }
    })
    newEvent = removedUtcEvent
  } else if (eventModel === 'Flight') {
    newEvent = newEvent.map(instance => {
      var removedUtcInstance = {}
      Object.keys(instance).forEach(key => {
        if (key !== 'startTimeUtcZero' && key !== 'endTimeUtcZero') {
          removedUtcInstance[key] = instance[key]
        }
      })
      return removedUtcInstance
    })
  }
  // console.log('newEvent after removing utc properties', newEvent)
  // console.log('loadSequenceInput', loadSequenceInput)

  var output = {
    newEvent,
    loadSequenceInput
  }

  return output
}

export default newEventLoadSeqAssignment
