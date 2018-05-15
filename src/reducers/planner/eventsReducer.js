export const eventsReducer = (state = {events: [], refetch: true}, action) => {
  switch (action.type) {
    case 'INITIALIZE_EVENTS':
      return {...state, ...{events: action.events, refetch: true}}
    case 'UPDATE_EVENT':
      const modifiedEvent = {...state.events.slice(action.index, action.index + 1)[0], ...{[action.property]: action.value}}
      return {events: [...state.events.filter((event, i) => i !== action.index), ...[modifiedEvent]].sort((a, b) => a.startDay - b.startDay || a.loadSequence - b.loadSequence), refetch: false}
    default:
      return state
  }
}
