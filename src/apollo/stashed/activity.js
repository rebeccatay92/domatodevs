import { gql } from 'react-apollo'

export const createActivity = gql`
  mutation createActivity(
    $ItineraryId: ID!,
    $loadSequence: Int
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $utcOffset: Int,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $locationAlias: String,
    $description: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $notes: String,
    $attachments: [attachmentInput],
    $backgroundImage: String,
    $openingHoursValidation: String,
    $allDayEvent: Boolean
  ) {
    createActivity(
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      utcOffset: $utcOffset,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      locationAlias: $locationAlias
      description: $description,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      notes: $notes,
      attachments: $attachments,
      backgroundImage: $backgroundImage,
      openingHoursValidation: $openingHoursValidation,
      allDayEvent: $allDayEvent
    ) {
      id
    }
  }
`

export const updateActivity = gql`
  mutation updateActivity(
    $id: ID!,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $utcOffset: Int,
    $loadSequence: Int,
    $googlePlaceData: googlePlaceData,
    $locationAlias: String,
    $description: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $notes: String,
    $backgroundImage: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID],
    $openingHoursValidation: String,
    $allDayEvent: Boolean
  ) {
    updateActivity(
      id: $id,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      utcOffset: $utcOffset,
      loadSequence: $loadSequence,
      googlePlaceData: $googlePlaceData,
      locationAlias: $locationAlias
      description: $description,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      notes: $notes,
      backgroundImage: $backgroundImage,
      addAttachments: $addAttachments,
      removeAttachments: $removeAttachments,
      openingHoursValidation: $openingHoursValidation,
      allDayEvent: $allDayEvent
    ) {
      id
    }
  }
`

export const deleteActivity = gql`
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`
