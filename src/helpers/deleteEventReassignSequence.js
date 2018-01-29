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

// given the events arr, and the model and id to remove, will return changingLoadSequence input arr
export function deleteEventReassignSequence (eventsArr, eventType, modelId) {
  var loadSequenceInputArr = []

  var newEventsArr = eventsArr.filter(e => {
    var isDeletedEvent = (e.type === eventType && e.modelId === modelId)
    return (!isDeletedEvent)
  })
  console.log('newEventsArr', newEventsArr)

  // find all affected days
  var daysArr = []
  newEventsArr.forEach(e => {
    if (!daysArr.includes(e.day)) {
      daysArr.push(e.day)
    }
  })

  // for each affected day reassign seq
  daysArr.forEach(day => {
    var dayEvents = newEventsArr.filter(e => {
      return e.day === day
    })
    dayEvents.forEach(event => {
      var correctLoadSeq = dayEvents.indexOf(event) + 1
      if (event.loadSequence !== correctLoadSeq) {
        var loadSequenceInputObj = constructLoadSeqInputObj(event, correctLoadSeq)
        loadSequenceInputArr.push(loadSequenceInputObj)
      }
    })
  })
  return loadSequenceInputArr
}
