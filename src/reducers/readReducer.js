const arr = [
  {
    title: 'Before the Trip',
    type: 'Heading',
    loadSequence: 1
  },
  {
    title: 'Introduction',
    type: 'Post',
    textContent: 'Visiting India had been my goal since a long time ago. Everyone had been discouraging me to go to India based on their impression that it\'s especially unsafe for female travellers. I mean, I know so many female travellers who visit India alone. I would not say India is 100% safe, but then again which part of this world is guaranteed to be safe? Nothing should stop you from exploring places as long as you plan well and know what you are doing. It would be best if you have someone to travel with you should you be concerned about traveling alone.\n\nI first heard about Ladakh two years ago from my good friend KW. We agreed to make it happen this year. Unfortunately, just a month before the trip, KW had to stand us up because of his work schedule. Eventually it became a duo trip of just me and ST, which was a new experience! Haha.\n\nWe had only 9 days and the highlight of the trip was Ladakh. We didn\'t think it was possible to include Jaipur and Taj Mahal in our initial plan due to our short travel period, but because I insisted (HAHA), it took me almost a week to come out with the following itinerary, which then unexpectedly gave us an extra day at the end (read on to find out how we earned the extra day).',
    loadSequence: 2,
    contentOnly: true
  },
  {
    title: 'e-Visa',
    type: 'Post',
    textContent: 'All Tibetans will require an e-visa to travel to India, unless you are the Domai Lama',
    loadSequence: 3,
    contentOnly: true
  },
  {
    title: 'Day 1',
    type: 'Heading',
    loadSequence: 4
  },
  {
    location: 'Pandya Niwass',
    eventType: 'Lodging',
    description: 'Check In',
    start: true,
    startDay: 1,
    endDay: 6,
    type: 'Post',
    loadSequence: 5,
    textContent: 'Upon arriving at Lajurama, we found the Domai Lama Statue in the centre of the plaza, Pandya Niwass was just right beside it.',
    contentOnly: false
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
