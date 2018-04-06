import { gql } from 'react-apollo'

export const findBlogHeading = gql`
  query findBlogHeading($id: ID!) {
    findBlogHeading(id: $id) {
      id
      BlogId
      loadSequence
      title
    }
  }
`

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
    }
  }
`
export const updateBlogHeading = gql`
  mutation updateBlogHeading(
    $id: ID!,
    $loadSequence: Int,
    $title: String
  ) {
    updateBlogHeading(
      id: $id,
      loadSequence: $loadSequence,
      title: $title
    ) {
      id
    }
  }
`

export const deleteBlogHeading = gql`
  mutation deleteBlogHeading($id: ID!) {
    deleteBlogHeading(id: $id)
  }
`
