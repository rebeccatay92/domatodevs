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
      } else if (action.column !== 'startTime' && action.column !== 'cost') {
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
      // console.log('modifiedEvent', modifiedEvent)
      // console.log('in redux locationName plain text', modifiedEvent.locationName.getPlainText())
      return {
        events: [...state.events.filter((event) => event.id !== action.id), ...[modifiedEvent]],
        // .sort((a, b) => a.startDay - b.startDay || a.loadSequence - b.loadSequence)
        refetch: false,
        updatedId: action.id,
        updatedProperty: action.property,
        updatedFromSidebar: action.fromSidebar
      }
    default:
      return state
  }
}
