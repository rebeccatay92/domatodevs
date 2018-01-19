export const plannerTimelineDayReducer = (state = {timelineAtTop: false, dateOffsets: {'day 1': true}}, action) => {
  switch (action.type) {
    case 'TOGGLE_TIMELINE_DAY':
      return action.options
    default:
      return state
  }
}
