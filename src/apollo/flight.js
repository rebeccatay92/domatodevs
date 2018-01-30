import { gql } from 'react-apollo'

export const findFlightBooking = gql`
  query findFlightBooking($id: ID!) {
    findFlightBooking(id: $id) {
      id
      ItineraryId
      paxAdults
      paxChildren
      paxInfants
      cost
      currency
      classCode
      departureDate
      returnDate
      departureIATA
      arrivalIATA
      departureName
      arrivalName
      bookingStatus
      bookedThrough
      bookingConfirmation
      backgroundImage
      flightInstances {
        id
        flightNumber
        airlineCode
        airlineName
        departureIATA
        arrivalIATA
        departureAirport
        arrivalAirport
        departureCityCountry
        arrivalCityCountry
        departureLocation {
          id
          placeId
          country {
            id
            name
          }
          name
          telephone
          address
          latitude
          longitude
          utcOffset
          openingHours {
            open {
              day
              time
            }
            close {
              day
              time
            }
          }
          openingHoursText
        }
        arrivalLocation {
          id
          placeId
          country {
            id
            name
          }
          name
          telephone
          address
          latitude
          longitude
          utcOffset
          openingHours {
            open {
              day
              time
            }
            close {
              day
              time
            }
          }
          openingHoursText
        }
        departureTerminal
        arrivalTerminal
        startDay
        endDay
        startTime
        endTime
        departureUtcOffset
        arrivalUtcOffset
        durationMins
        startLoadSequence
        endLoadSequence
        departureNotes
        arrivalNotes
        firstFlight
        attachments {
          id
          fileName
          fileAlias
          fileType
          fileSize
          arrivalDeparture
        }
      }
    }
  }
`

export const createFlightBooking = gql`
  mutation createFlightBooking(
    $ItineraryId: ID!,
    $paxAdults: Int,
    $paxChildren: Int,
    $paxInfants: Int,
    $cost: Int,
    $currency: String,
    $classCode: String,
    $departureDate: Int,
    $returnDate: Int,
    $departureIATA: String,
    $arrivalIATA: String,
    $departureName: String,
    $arrivalName: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
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
      departureDate: $departureDate,
      returnDate: $returnDate,
      departureIATA: $departureIATA,
      arrivalIATA: $arrivalIATA,
      departureName: $departureName,
      arrivalName: $arrivalName,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
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
    $paxAdults: Int,
    $paxChildren: Int,
    $paxInfants: Int,
    $cost: Int,
    $currency: String,
    $classCode: String,
    $departureDate: Int,
    $returnDate: Int,
    $departureIATA: String,
    $arrivalIATA: String,
    $departureName: String,
    $arrivalName: String,
    $bookingStatus: Boolean,
    $bookedThrough: String,
    $bookingConfirmation: String,
    $backgroundImage: String,
    $changedFlight: Boolean,
    $flightInstances: [updateFlightInstanceInput]
  ) {
    updateFlightBooking(
      id: $id,
      paxAdults: $paxAdults,
      paxChildren: $paxChildren,
      paxInfants: $paxInfants,
      cost: $cost,
      currency: $currency,
      classCode: $classCode,
      departureDate: $departureDate,
      returnDate: $returnDate,
      departureIATA: $departureIATA,
      arrivalIATA: $arrivalIATA,
      departureName: $departureName,
      arrivalName: $arrivalName,
      bookingStatus: $bookingStatus,
      bookedThrough: $bookedThrough,
      bookingConfirmation: $bookingConfirmation,
      backgroundImage: $backgroundImage,
      changedFlight: $changedFlight,
      flightInstances: $flightInstances
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
  query findFlightInstance($id: ID!) {
    findFlightInstance(id: $id) {
      id
      FlightBookingId
      flightNumber
      airlineName
      airlineCode
      departureIATA
      arrivalIATA
      departureAirport
      arrivalAirport
      departureCityCountry
      arrivalCityCountry
      departureLocation {
        id
        placeId
        country {
          id
          name
        }
        name
        telephone
        address
        latitude
        longitude
        utcOffset
        openingHours {
          open {
            day
            time
          }
          close {
            day
            time
          }
        }
        openingHoursText
      }
      arrivalLocation {
        id
        placeId
        country {
          id
          name
        }
        name
        telephone
        address
        latitude
        longitude
        utcOffset
        openingHours {
          open {
            day
            time
          }
          close {
            day
            time
          }
        }
        openingHoursText
      }
      departureTerminal
      arrivalTerminal
      startDay
      endDay
      startTime
      endTime
      departureUtcOffset
      arrivalUtcOffset
      durationMins
      startLoadSequence
      endLoadSequence
      departureNotes
      arrivalNotes
      attachments {
        id
        fileName
        fileAlias
        fileType
        fileSize
        arrivalDeparture
      }
    }
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
    $departureAirport: String,
    $arrivalAirport: String,
    $departureCityCountry: String,
    $arrivalCityCountry: String,
    $departureTerminal: String,
    $arrivalTerminal: String,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $departureUtcOffset: Int,
    $arrivalUtcOffset: Int,
    $durationMins: Int,
    $startLoadSequence: Int,
    $endLoadSequence: Int,
    $departureNotes: String,
    $arrivalNotes: String,
    $addAttachments: [attachmentInput],
    $removeAttachments: [ID]
  ) {
    updateFlightInstance(
      id: $id,
      FlightBookingId: $FlightBookingId,
      flightNumber: $flightNumber,
      airlineName: $airlineName,
      airlineCode: $airlineCode,
      departureIATA: $departureIATA,
      arrivalIATA: $arrivalIATA,
      departureAirport: $departureAirport,
      arrivalAirport: $arrivalAirport,
      departureCityCountry: $departureCityCountry,
      arrivalCityCountry: $arrivalCityCountry,
      departureTerminal: $departureTerminal,
      arrivalTerminal: $arrivalTerminal,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      departureUtcOffset: $departureUtcOffset,
      arrivalUtcOffset: $arrivalUtcOffset,
      durationMins: $durationMins,
      startLoadSequence: $startLoadSequence,
      endLoadSequence: $endLoadSequence,
      departureNotes: $departureNotes,
      arrivalNotes: $arrivalNotes,
      addAttachments: $addAttachments,
      removeAttachments: $removeAttachments
    ) {
      id
    }
  }
`

export const deleteFlightInstance = gql`
  mutation deleteFlightInstance($id: ID!) {
    deleteFlightInstance(id: $id)
  }
`
