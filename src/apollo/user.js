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

export const updateUserProfile = gql`
  mutation updateUserProfile(
    $CountryId: ID,
    $fullName: String,
    $bio: String,
    $profilePic: String
  ) {
    updateUserProfile(
      CountryId: $CountryId,
      fullName: $fullName,
      bio: $bio,
      profilePic: $profilePic
    ) {
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
