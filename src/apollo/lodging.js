import { gql } from 'react-apollo'

export const createLodging = gql`
  mutation createLodging(
    $ItineraryId: ID!,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $locationAlias: String,
    $startLoadSequence: Int,
    $endLoadSequence:Int,
    $description: String,
    $notes: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInput],
    $backgroundImage: String
  ) {
    createLodging(
      ItineraryId: $ItineraryId,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      locationAlias: $locationAlias,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      description: $description,
      notes: $notes,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      attachments: $attachments,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const updateLodging = gql`
  mutation updateLodging(
    $id: ID!,
    $googlePlaceData: googlePlaceData,
    $locationAlias: String,
    $description: String,
    $notes: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID],
  ) {
    updateLodging(
      id: $id,
      googlePlaceData: $googlePlaceData,
      locationAlias: $locationAlias,
      description: $description,
      notes: $notes,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      cost: $cost,
      currency: $currency,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
      addAttachments: $addAttachments,
      removeAttachments: $removeAttachments
    ) {
      id
    }
  }
`

export const deleteLodging = gql`
  mutation deleteLodging($id: ID!) {
    deleteLodging(id: $id)
  }
`
