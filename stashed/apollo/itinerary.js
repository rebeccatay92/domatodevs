import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      id
      name
      description
      # countries {
      #   id
      #   name
      #   code
      # }
      days
      startDate
      events {
        modelId
        type
        loadSequence
        start
        day
        time
        utcOffset
        timeUtcZero
        Activity {
          id
          description
          startTime
          endTime
          utcOffset
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
            imageUrl
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
            imageUrl
          }
          locationAlias
          startDay
          endDay
          startTime
          endTime
          utcOffset
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
            imageUrl
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
          arrivalNotes
          departureNotes
          attachments {
            id
            fileName
            fileAlias
            fileType
            fileSize
            arrivalDeparture
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
            imageUrl
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
            imageUrl
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
            imageUrl
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
            imageUrl
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
            imageUrl
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
            imageUrl
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
          backgroundImage
        }
        Flight {
          FlightInstance {
            id
            FlightBookingId
            flightNumber
            airlineCode
            airlineName
            departureIATA
            arrivalIATA
            departureAirport
            arrivalAirport
            departureCityCountry
            arrivalCityCountry
            durationMins
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
              imageUrl
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
              imageUrl
            }
            departureTerminal
            arrivalTerminal
            startDay
            endDay
            startTime
            endTime
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
          FlightBooking {
            id
            ItineraryId
            paxAdults
            paxChildren
            paxInfants
            cost
            currency
            classCode
            departureIATA
            arrivalIATA
            departureName
            arrivalName
            departureDate
            returnDate
            bookingStatus
            bookedThrough
            bookingConfirmation
            backgroundImage
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
        username
        email
      }
      users {
        id
        username
        email
      }
    }
  }`

export const itinerariesByUser = gql`
  query itinerariesByUser {
    itinerariesByUser {
      id
      name
      description
      days
      startDate
      # countries {
      #   id
      #   name
      #   code
      # }
      owner {
        id
        username
        email
      }
      # users {
      #   id
      #   name
      #   email
      # }
    }
  }`

export const createItinerary = gql`
  mutation createItinerary(
    $UserId: Int!,
    # $CountryId: Int,
    $name: String!,
    $description: String,
    $days: Int!,
    $startDate: Int
  ) {
    createItinerary(
      UserId:$UserId,
      # CountryId: $CountryId,
      name: $name,
      description: $description,
      days: $days,
      startDate: $startDate
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
    $description: String,
    $startDate: Int,
    $days: Int
  ) {
    updateItineraryDetails(
      id: $id,
      name: $name,
      description: $description,
      startDate: $startDate,
      days: $days
    ) {
      id
      name
      description
      days
      startDate
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
