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
    case 'UPDATE_EVENT':
      console.log('property in redux', action.property, 'value', action.value)
      const modifiedEvent = {
        ...state.events.filter(event => event.id === action.id)[0], ...{[action.property]: action.value}
      }
      // console.log('modifiedEvent', modifiedEvent)
      console.log('in redux location plain text', modifiedEvent.location.getPlainText())
      return {
        events: [...state.events.filter((event) => event.id !== action.id), ...[modifiedEvent]].sort((a, b) => a.startDay - b.startDay || a.loadSequence - b.loadSequence),
        refetch: false,
        updatedId: action.id,
        updatedProperty: action.property,
        updatedFromSidebar: action.fromSidebar
      }
    default:
      return state
  }
}
