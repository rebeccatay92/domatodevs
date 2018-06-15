import { gql } from 'react-apollo'

export const findBlogHeading = gql`
  query findBlogHeading($id: ID!) {
    findBlogHeading(id: $id) {
      id
      BlogId
      loadSequence
      title
      medium {
        id
        type
        objectName
        imageUrl
        youtubeUrl
      }
    }
  }
`

// CRUD NEEDS TO BE RELOOKED FOR NEW BLOG STRUCTURE
export const createBlogHeading = gql`
  mutation createBlogHeading(
    $BlogId: ID!,
    $loadSequence: Int!
  ) {
    createBlogHeading(
      BlogId: $BlogId,
      loadSequence: $loadSequence
    ) {
      id
      BlogId
      loadSequence
      title
      medium {
        id
        type
        objectName
        imageUrl
        youtubeUrl
      }
    }
  }
`
export const updateBlogHeading = gql`
  mutation updateBlogHeading(
    $id: ID!,
    $loadSequence: Int,
    $title: String,
    $MediumId: ID
  ) {
    updateBlogHeading(
      id: $id,
      loadSequence: $loadSequence,
      title: $title,
      MediumId: $MediumId
    ) {
      id
      loadSequence
      title
      medium {
        id
        type
        objectName
        imageUrl
        youtubeUrl
      }
    }
  }
`

export const deleteBlogHeading = gql`
  mutation deleteBlogHeading($id: ID!) {
    deleteBlogHeading(id: $id)
  }
`
