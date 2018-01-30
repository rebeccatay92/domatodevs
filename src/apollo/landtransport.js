import { gql } from 'react-apollo'

export const createLandTransport = gql`
  mutation createLandTransport(
    $ItineraryId: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $departureLocationAlias: String,
    $arrivalLocationAlias: String,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $departureUtcOffset: Int,
    $arrivalUtcOffset: Int,
    $departureNotes: String,
    $arrivalNotes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $attachments: [attachmentInput],
    $backgroundImage: String
  ) {
    createLandTransport(
      ItineraryId: $ItineraryId,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      departureLocationAlias: $departureLocationAlias,
      arrivalLocationAlias: $arrivalLocationAlias,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      departureUtcOffset: $departureUtcOffset,
      arrivalUtcOffset: $arrivalUtcOffset,
      departureNotes: $departureNotes,
      arrivalNotes: $arrivalNotes,
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

export const updateLandTransport = gql`
  mutation updateLandTransport(
    $id: ID!,
    $departureGooglePlaceData: googlePlaceData,
    $arrivalGooglePlaceData: googlePlaceData,
    $departureLocationAlias: String,
    $arrivalLocationAlias: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $departureUtcOffset: Int,
    $arrivalUtcOffset: Int,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $departureNotes: String,
    $arrivalNotes: String,
    $cost: Int,
    $currency: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID]
  ) {
    updateLandTransport(
      id: $id,
      departureGooglePlaceData: $departureGooglePlaceData,
      arrivalGooglePlaceData: $arrivalGooglePlaceData,
      departureLocationAlias: $departureLocationAlias,
      arrivalLocationAlias: $arrivalLocationAlias,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      departureUtcOffset: $departureUtcOffset,
      arrivalUtcOffset: $arrivalUtcOffset,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      departureNotes: $departureNotes,
      arrivalNotes: $arrivalNotes,
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

export const deleteLandTransport = gql`
  mutation deleteLandTransport($id: ID!) {
    deleteLandTransport(id: $id)
  }
`
