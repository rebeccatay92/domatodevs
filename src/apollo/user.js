import { gql } from 'react-apollo'

export const getUserProfile = gql`
  query getUserProfile {
    getUserProfile {
      id
      fullName
      username
      email
      profilePic
      CountryId
      country {
        id
        name
        code
      }
      bio
    }
  }
`
