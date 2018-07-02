export const eventsReducer = (state = {
  events: [],
  refetch: true,
  updatedId: '',
  updatedProperty: '',
  updatedFromSidebar: false
}, action) => {
  switch (action.type) {
    case 'INITIALIZE_EVENTS':
      return {
        ...state,
        ...{
          events: action.events,
          refetch: true
        }
      }
    case 'SORT_EVENTS':
      if (action.sortType === 'unsorted') {
        return {
          ...state,
          ...{
            events: [...state.events.sort((a, b) => {
              return a.startDay - b.startDay || a.loadSequence - b.loadSequence
            })],
            refetch: true
          }
        }
      } else if (action.column !== 'startTime' && action.column !== 'cost' && action.column !== 'location') {
        return {
          ...state,
          ...{
            events: [...state.events.sort((a, b) => {
              const nameA = a[action.column].getPlainText().toUpperCase()
              const nameB = b[action.column].getPlainText().toUpperCase()
              if (action.sortType === 'ascending') {
                if (nameA > nameB) return 1
                if (nameB > nameA) return -1
                return 0
              } else {
                if (nameA > nameB) return -1
                if (nameB > nameA) return 1
                return 0
              }
            })],
            refetch: true
          }
        }
      } else if (action.column === 'cost') {
        return {
          ...state,
          ...{
            events: [...state.events.sort((a, b) => {
              if (action.sortType === 'ascending') {
                return parseInt(a[action.column].getPlainText()) - parseInt(b[action.column].getPlainText())
              } else {
                return parseInt(b[action.column].getPlainText()) - parseInt(a[action.column].getPlainText())
              }
            })],
            refetch: true
          }
        }
      } else if (action.column === 'location') {
        return {
          ...state,
          ...{
            events: [...state.events.sort((a, b) => {
              const nameA = a.locationName.getPlainText().toUpperCase()
              const nameB = b.locationName.getPlainText().toUpperCase()
              if (action.sortType === 'ascending') {
                if (nameA > nameB) return 1
                if (nameB > nameA) return -1
                return 0
              } else {
                if (nameA > nameB) return -1
                if (nameB > nameA) return 1
                return 0
              }
            })],
            refetch: true
          }
        }
      } else if (action.column === 'startTime') {
        return {
          ...state,
          ...{
            events: [...state.events.sort((a, b) => {
              const timeA = a.startTime
              const unixA = timeA.substring(0, 2) * 3600 + timeA.substring(3, 5) * 60
              const timeB = b.startTime
              const unixB = timeB.substring(0, 2) * 3600 + timeB.substring(3, 5) * 60
              if (action.sortType === 'ascending') {
                return unixA - unixB
              } else {
                return unixB - unixA
              }
            })],
            refetch: true
          }
        }
      } else {
        return state
      }
    case 'UPDATE_EVENT':
      if (!action.property) {
        return {...state, ...{updatedFromSidebar: action.fromSidebar}}
      }
      // console.log('property in redux', action.property, 'value', action.value)
      const modifiedEvent = {
        ...state.events.filter(event => event.id === action.id)[0], ...{[action.property]: action.value}
      }
      return {
        events: [...state.events.filter((event) => event.id !== action.id), ...[modifiedEvent]].sort((a, b) => a.startDay - b.startDay || a.loadSequence - b.loadSequence),
        //MUST BE SORTED IN SAME ORDER AS EVENTINDEX, ELSE CELLS DONT KNOW WHICH IS NEXT ACTIVEEVENTID TO SET
        refetch: false,
        updatedId: action.id,
        updatedProperty: action.property === 'currency' ? 'cost' : action.property,
        updatedFromSidebar: action.fromSidebar
      }
    case 'HOVER_OVER_EVENT':
      let targetDayEventsArr = state.events.filter(event => event.startDay === action.day && !event.dropzone)
      let newTargetDayEventsArr = [
        ...targetDayEventsArr.slice(0, action.index),
        ...[{startDay: action.day, dropzone: true}],
        ...targetDayEventsArr.slice(action.index)
      ].filter(event => event.id !== action.event.id)
      let eventsArrWithoutTargetDay = state.events.filter(event => event.startDay !== action.day && event.id !== action.event.id && !event.dropzone)
      console.log([...eventsArrWithoutTargetDay, ...newTargetDayEventsArr])
      return {
        ...state,
        ...{
          events: [...eventsArrWithoutTargetDay, ...newTargetDayEventsArr],
          refetch: true
        }
      }
    case 'DROP_PLANNER_EVENT':
      targetDayEventsArr = state.events.filter(event => event.startDay === action.event.startDay && !event.dropzone)
      newTargetDayEventsArr = [
        ...targetDayEventsArr.slice(0, action.index),
        ...[action.event],
        ...targetDayEventsArr.slice(action.index)
      ].map((event, i) => {
        return {
          ...event,
          ...{
            loadSequence: i + 1
          }
        }
      })
      eventsArrWithoutTargetDay = state.events.filter(event => event.startDay !== action.event.startDay)
      return {
        ...state,
        ...{
          events: [...eventsArrWithoutTargetDay, ...newTargetDayEventsArr],
          refetch: true
        }
      }
    default:
      return state
  }
}
