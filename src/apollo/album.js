import { gql } from 'react-apollo'

export const findAlbum = gql`
  query findAlbum(
    $id: ID!
  ) {
    findAlbum(id: $id) {
      id
      title
      description
      user {
        id
        username
      }
      media {
        id
        url
        type
      }
    }
  }
`

// userid passed through context.user
export const getUserAlbums = gql`
  query getUserAlbums {
    id
    title
    description
    media {
      id
      url
      type
    }
  }
`

export const createAlbum = gql`
  mutation createAlbum(
    $UserId: ID!
    $title: String
    $description: String
  ) {
    createAlbum(
      UserId: $UserId
      title: $title
      description: $description
    ) {
      id
      title
      description
    }
  }
`

export const updateAlbum = gql`
  mutation updateAlbum(
    $id: ID!
    $title: String
    $description: String
  ) {
    updateAlbum(
      id: $id
      title: $title
      description: $description
    ) {
      id
      title
      description
    }
  }
`

export const deleteAlbum = gql`
  mutation deleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`
