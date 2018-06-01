import { ContentState } from 'draft-js'

export function initializeEventsHelper (events, callback) {
  const allEvents = events.map(event => {
    return {
      ...event,
      ...{
        startTime: event.startTime ? new Date(event.startTime * 1000).toGMTString().substring(17, 22) : '',
        endTime: event.endTime ? new Date(event.endTime * 1000).toGMTString().substring(17, 22) : '',
        eventType: event.eventType ? ContentState.createFromText(event.eventType) : ContentState.createFromText(''),
        // content state for place name
        locationName: event.location ? ContentState.createFromText(event.location.name) : ContentState.createFromText(''),
        // regular json object holding verified, name, address, latlng, countrycode.
        locationObj: event.location ? {
          verified: event.location.verified,
          name: event.location.name,
          address: event.location.address,
          latitude: event.location.latitude,
          longitude: event.location.longitude,
          countryCode: event.location.country ? event.location.country.code : ''
        } : null,
        cost: event.cost ? ContentState.createFromText(event.cost) : ContentState.createFromText(''),
        notes: event.notes ? ContentState.createFromText(event.notes) : ContentState.createFromText(''),
        bookingService: event.bookingService ? ContentState.createFromText(event.bookingService) : ContentState.createFromText(''),
        bookingConfirmation: event.bookingConfirmation ? ContentState.createFromText(event.bookingConfirmation) : ContentState.createFromText('')
      }
    }
  })
  callback(allEvents)
}
