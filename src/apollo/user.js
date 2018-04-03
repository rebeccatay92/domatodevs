import { gql } from 'react-apollo'

// export const createToken = gql`
//   mutation createToken($email: String!, $password: String!) {
//     createToken(email: $email, password: $password)
//   }
// `

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
