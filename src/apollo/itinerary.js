import { gql } from 'react-apollo'

export const queryItinerary = gql`
  query queryItinerary($id: ID!) {
    findItinerary(id: $id){
      id
      name
      description
      isPrivate
      countries {
        id
        name
        code
      }
      days
      startDate
      events {
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
  }`

// export const allItineraries = gql`
//   query allItineraries {
//     allItineraries {
//       id
//       name
//       days
//       startDate
//       isPrivate
//       countries {
//         id
//         name
//         code
//       }
//       owner {
//         id
//         username
//         email
//       }
//       users {
//         id
//         username
//         email
//       }
//     }
//   }`

export const getAllPublishedItineraries = gql`
  query getAllPublishedItineraries {
    getAllPublishedItineraries {
      id
      name
      days
      startDate
      isPrivate
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
      createdAt
    }
  }
`

export const itinerariesByUser = gql`
  query itinerariesByUser {
    itinerariesByUser {
      id
      name
      description
      days
      startDate
      isPrivate
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
      # users {
      #   id
      #   name
      #   email
      # }
    }
  }`

export const createItinerary = gql`
  mutation createItinerary(
    $UserId: String!,
    $name: String!,
    $description: String,
    $days: Int!,
    $startDate: Int
  ) {
    createItinerary(
      UserId:$UserId,
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
      countries {
        id
        name
        code
      }
    }
  }`

export const updateItineraryDetails = gql`
  mutation updateItineraryDetails(
    $id: ID!,
    $name: String,
    $description: String,
    $startDate: Int,
    $days: Int,
    $isPrivate: Boolean,
    $countries: [ID]
  ) {
    updateItineraryDetails(
      id: $id,
      name: $name,
      description: $description,
      startDate: $startDate,
      days: $days,
      isPrivate: $isPrivate,
      countries: $countries
    ) {
      id
      name
      description
      days
      startDate
      isPrivate
      countries {
        id
        code
        name
      }
    }
  }`

export const deleteItinerary = gql`
  mutation deleteItinerary($id: ID!) {
    deleteItinerary(id: $id)
  }`

export const createCountriesItineraries = gql`
  mutation createCountriesItineraries(
    $ItineraryId: ID!,
    $CountryId: ID!
  ) {
    createCountriesItineraries(
      ItineraryId: $ItineraryId,
      CountryId: $CountryId
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
