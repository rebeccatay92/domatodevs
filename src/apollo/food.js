import { gql } from 'react-apollo'

export const createFood = gql`
  mutation createFood(
    $ItineraryId: ID!,
    $loadSequence: Int,
    $startDay: Int!,
    $endDay: Int!,
    $startTime: Int,
    $endTime: Int,
    $utcOffset: Int,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $locationAlias: String,
    $description: String,
    $notes: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInput],
    $backgroundImage: String,
    $openingHoursValidation: String,
    $allDayEvent: Boolean
  ) {
    createFood(
      ItineraryId: $ItineraryId,
      loadSequence: $loadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      utcOffset: $utcOffset,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      locationAlias: $locationAlias,
      description: $description,
      notes: $notes,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      attachments: $attachments,
      backgroundImage: $backgroundImage,
      openingHoursValidation: $openingHoursValidation,
      allDayEvent: $allDayEvent
    ) {
      id
    }
  }
`

export const updateFood = gql`
  mutation updateFood(
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
    $notes: String,
    $currency: String,
    $cost: Int,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID],
    $openingHoursValidation: String,
    $allDayEvent: Boolean
  ) {
    updateFood(
      id: $id,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      utcOffset: $utcOffset,
      loadSequence: $loadSequence,
      googlePlaceData: $googlePlaceData,
      locationAlias: $locationAlias,
      description: $description,
      notes: $notes,
      currency: $currency,
      cost: $cost,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
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

export const deleteFood = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(id: $id)
  }
`
