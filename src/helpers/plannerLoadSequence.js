/* import and use as follows.
import plannerLoadSequence from plannerLoadSequence
eg. plannerLoadSequence.createNewEvent(params)

PARAMETERS AND OUTPUT
createNewEvent
  Input: eventsArr that comes from backend + day:Int for newEvent
  Output: loadSequence:Int for newEvent
deleteEvent
  Input: eventsArr (before deletion) + EventId to remove
  Output: changingLoadSequence arr to update load seq of all affected events
dragDropOneEvent?
  Input: eventsArr after drop has occured. eg -> day1 drag to day 5.
  Output: changingLoadSequence arr
*/

function createNewEvent (eventsArr, insertIntoDay) {
  // filter out events in the affected day
  let eventsInDay = eventsArr.filter(e => {
    return e.startDay === insertIntoDay
  })
  // insert last
  let loadSequence = eventsInDay.length + 1
  return loadSequence
}

function deleteEvent (eventsArr, EventId) {
  let eventToDelete = eventsArr.find(e => {
    return e.id === EventId
  })
  // console.log('eventToDelete', eventToDelete)
  let affectedDay = eventToDelete.startDay

  let eventsInDay = eventsArr.filter(e => {
    return e.startDay === affectedDay
  })

  let changingLoadSequenceArr = []

  eventsInDay.forEach((event, i) => {
    if (event.loadSequence !== i + 1) {
      changingLoadSequenceArr.push({
        EventId: event.id,
        startDay: event.startDay,
        loadSequence: i + 1
      })
    }
  })
  return changingLoadSequenceArr
}

export const plannerLoadSequence = {
  createNewEvent,
  deleteEvent
}
