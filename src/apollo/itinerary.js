import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      id
      name
      description
      countries {
        id
        name
        code
      }
      days
      startDate
      events {
        modelId
        type
        loadSequence
        start
        day
        time
        Activity {
          id
          description
          startTime
          endTime
          location {
            id
            placeId
            name
            address
            telephone
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
          locationAlias
          startDay
          endDay
          loadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
          openingHoursValidation
          allDayEvent
        }
        Food {
          id
          description
          location {
            id
            placeId
            name
            address
            telephone
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
          locationAlias
          startDay
          endDay
          startTime
          endTime
          loadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
          openingHoursValidation
          allDayEvent
        }
        Lodging {
          id
          description
          location {
            id
            placeId
            name
            address
            telephone
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
          locationAlias
          startDay
          endDay
          startTime
          endTime
          startLoadSequence
          endLoadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        LandTransport {
          id
          departureLocation {
            id
            placeId
            name
            address
            telephone
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
            name
            address
            telephone
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
          departureLocationAlias
          arrivalLocationAlias
          startDay
          startTime
          endDay
          endTime
          startLoadSequence
          endLoadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        SeaTransport {
          id
          departureLocation {
            id
            placeId
            name
            address
            telephone
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
            name
            address
            telephone
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
          departureLocationAlias
          arrivalLocationAlias
          startDay
          startTime
          endDay
          endTime
          startLoadSequence
          endLoadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        Train {
          id
          departureLocation {
            id
            placeId
            name
            address
            telephone
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
            name
            address
            telephone
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
          departureLocationAlias
          arrivalLocationAlias
          startDay
          startTime
          endDay
          endTime
          startLoadSequence
          endLoadSequence
          currency
          cost
          bookedThrough
          bookingConfirmation
          bookingStatus
          notes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
          }
          backgroundImage
        }
        Flight {
          FlightInstance {
            id
            FlightBookingId
            flightNumber
            airlineCode
            airlineName
            departureLocation {
              id
              placeId
              name
              address
              telephone
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
              name
              address
              telephone
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
                }
              }
              openingHoursText
            }
            departureTerminal
            arrivalTerminal
            departureGate
            arrivalGate
            startDay
            endDay
            startTime
            endTime
            startLoadSequence
            endLoadSequence
            notes
            firstFlight
          }
          FlightBooking {
            id
            ItineraryId
            paxAdults
            paxChildren
            paxInfants
            cost
            currency
            classCode
            bookingStatus
            bookedThrough
            bookingConfirmation
            backgroundImage
            attachments {
              id
              fileName
              fileAlias
              fileType
              fileSize
            }
          }
        }
      }
    }
  }`

export const allItineraries = gql`
  query allItineraries {
    allItineraries {
      id
      name
      days
      startDate
      countries {
        id
        name
        code
      }
      owner {
        id
        name
        email
      }
      users {
        id
        name
        email
      }
    }
  }`

export const itinerariesByUser = gql`
  query itinerariesByUser {
    itinerariesByUser {
      id
      name
      days
      startDate
      description
      countries {
        id
        name
        code
      }
      owner {
        id
        name
        email
      }
      users {
        id
        name
        email
      }
    }
  }`

export const createItinerary = gql`
  mutation createItinerary(
    $UserId: Int!,
    $CountryId: Int,
    $name: String!,
    $days: Int!,
    $startDate: Int
    $description: String
  ) {
    createItinerary(
      UserId:$UserId,
      CountryId: $CountryId,
      name: $name,
      days: $days,
      startDate: $startDate
      description: $description
    ) {
      id
      name
      days
      startDate
      description
    }
  }`

export const updateItineraryDetails = gql`
  mutation updateItineraryDetails(
    $id: ID!,
    $name: String,
    $startDate: Int,
    $days: Int,
    $description: String
  ) {
    updateItineraryDetails(
      id: $id,
      name: $name,
      startDate: $startDate,
      days: $days,
      description: $description
    ) {
      id
      name
      days
      startDate
      days
      description
    }
  }`

export const deleteItinerary = gql`
  mutation deleteItinerary($id: ID!) {
    deleteItinerary(id: $id)
  }`

export const createCountriesItineraries = gql`
  mutation createCountriesItineraries(
    $ItineraryId: Int!,
    $countryCode: String!
  ) {
    createCountriesItineraries(
      ItineraryId: $ItineraryId,
      countryCode: $countryCode
    ) {
      ItineraryId
      CountryId
    }
  }`

export const deleteCountriesItineraries = gql`
    mutation deleteCountriesItineraries(
      $ItineraryId: Int!,
      $CountryId: Int!
    ) {
      deleteCountriesItineraries(
        ItineraryId: $ItineraryId,
        CountryId: $CountryId
      )
    }`
