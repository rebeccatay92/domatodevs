export const mapPlannerDaysFilterReducer = (state = [1], action) => {
  switch (action.type) {
    case 'TOGGLE_DAYS_FILTER':
      // add or remove day from daysFilterArr when checkbox is ticked/unticked. intially day 1 is checked
      var day = action.dayInt
      if (state.includes(day)) {
        return state.filter(e => {
          return e !== day
        })
      } else {
        return [...state, day]
      }
    default:
      return state
  }
}
