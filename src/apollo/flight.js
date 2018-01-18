import { gql } from 'react-apollo'

export const createFlightBooking = gql`
  mutation createFlightBooking(
    $ItineraryId: ID!,
    $paxAdults: Int,
    $paxChildren: Int,
    $paxInfants: Int,
    $cost: Int,
    $currency: String,
    $classCode: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $attachments: [attachmentInput],
    $flightInstances: [createFlightInstanceInput]
  ) {
    createFlightBooking(
      ItineraryId: $ItineraryId,
      paxAdults: $paxAdults,
      paxChildren: $paxChildren,
      paxInfants: $paxInfants,
      cost: $cost,
      currency: $currency,
      classCode: $classCode,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
      attachments: $attachments,
      flightInstances: $flightInstances
      ) {
      id
    }
  }
`

// UPDATE FLIGHT NOT YET DONE
export const updateFlightBooking = gql`
  mutation updateFlightBooking(
    $id: ID!,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String
  ) {
    updateFlightBooking(
      id: $id,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage
    ) {
      id
    }
  }
`

export const deleteFlightBooking = gql`
  mutation deleteFlightBooking($id: ID!) {
    deleteFlightBooking(id: $id)
  }
`

export const findFlightInstance = gql`
  findFlightInstance($id: ID!) {
    findFlightInstance(id: $id)
  }
`

export const updateFlightInstance = gql`
  mutation updateFlightInstance(
    $id: ID!
    $FlightBookingId: ID,
    $flightNumber: Int,
    $airlineName: String,
    $airlineCode: String,
    $departureIATA: String,
    $arrivalIATA: String,
    $departureTerminal: String,
    $arrivalTerminal: String,
    $departureGate: String,
    $arrivalGate: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $notes: String,
    $firstFlight: Boolean
  ) {
    updateFlightInstance(
      id: $id,
      FlightBookingId: $FlightBookingId,
      flightNumber: $flightNumber,
      airlineName: $airlineName,
      airlineCode: $airlineCode,
      departureIATA: $departureIATA,
      arrivalIATA: $arrivalIATA,
      departureTerminal: $departureTerminal,
      arrivalTerminal: $arrivalTerminal,
      departureGate: $departureGate,
      arrivalGate: $arrivalGate,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      notes: $notes,
      firstFlight: $firstFlight
    )
  }
`

export const deleteFlightInstance = gql`
  mutation deleteFlightInstance(id: ID!) {
    deleteFlightInstance(id: ID!)
  }
`
