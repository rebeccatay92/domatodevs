export const eventsReducer = (state = {events: [], refetch: true}, action) => {
  switch (action.type) {
    case 'INITIALIZE_EVENTS':
      return {...state, ...{events: action.events, refetch: true}}
    case 'UPDATE_EVENT':
      const modifiedEvent = {...state.events.filter(event => event.id === action.id)[0], ...{[action.property]: action.value}}
      return {events: [...state.events.filter((event) => event.id !== action.id), ...[modifiedEvent]].sort((a, b) => a.startDay - b.startDay || a.loadSequence - b.loadSequence), refetch: false}
    default:
      return state
  }
}
