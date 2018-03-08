const arr = [
  {
    title: 'Before the Trip',
    type: 'Heading'
  },
  {
    title: 'Introduction',
    type: 'ContentOnly'
  },
  {
    title: 'e-Visa',
    type: 'ContentOnly'
  },
  {
    title: 'Day 1',
    type: 'Heading'
  },
  {
    location: 'Pandya Niwass',
    eventType: 'Lodging',
    description: 'Check In',
    start: true,
    day: 1,
    type: 'Event'
  }
]

export const readReducer = (state = {postsArr: arr, activePostIndex: 'home'}, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return {postsArr: action.articles, activePostIndex: 'home'}
    case 'CHANGE_ACTIVE_POST':
      return {...state, ...{activePostIndex: action.index}}
    default:
      return state
  }
}
