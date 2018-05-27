import { gql } from 'react-apollo'

export const findEvent = gql`
  query findEvent($id: ID!) {
    findEvent(id: $id) {
      id
      ItineraryId
      eventType
      startDay
      startTime
      endTime
      loadSequence
      notes
      cost
      currency
      bookingService
      bookingConfirmation
      location {
        id
        verified
        name
        address
        latitude
        longitude
        CountryId
        country {
          id
          name
          code
        }
      }
      attachments {
        id
        fileName
        fileAlias
        fileSize
        fileType
      }
    }
  }
`

export const createEvent = gql`
  mutation createEvent(
    $ItineraryId: ID!,
    $eventType: String,
    $startDay: Int!,
    $startTime: Int,
    $endTime: Int,
    $loadSequence: Int!,
    $notes: String,
    $cost: String,
    $currency: String,
    $bookingService: String,
    $bookingConfirmation: String,
    $locationData: locationDataInput,
    $LocationId: ID
  ) {
    createEvent(
      ItineraryId: $ItineraryId,
      eventType: $eventType,
      startDay: $startDay,
      startTime: $startTime,
      endTime: $endTime,
      loadSequence: $loadSequence,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingService: $bookingService,
      bookingConfirmation: $bookingConfirmation,
      locationData: $locationData,
      LocationId: $LocationId
    ) {
      id
    }
  }
`

export const updateEventBackend = gql`
  mutation updateEventBackend(
    $id: ID!,
    $eventType: String,
    $startDay: Int,
    $startTime: Int,
    $endTime: Int,
    $loadSequence: Int,
    $notes: String,
    $cost: String,
    $currency: String,
    $bookingService: String,
    $bookingConfirmation: String,
    $locationData: locationDataInput,
    $LocationId: ID
  ) {
    updateEvent(
      id: $id,
      eventType: $eventType,
      startDay: $startDay,
      startTime: $startTime,
      endTime: $endTime,
      loadSequence: $loadSequence,
      notes: $notes,
      cost: $cost,
      currency: $currency,
      bookingService: $bookingService,
      bookingConfirmation: $bookingConfirmation,
      locationData: $locationData,
      LocationId: $LocationId
    ) {
      id
    }
  }
`

export const deleteEvent = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`
