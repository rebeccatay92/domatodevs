import { gql } from 'react-apollo'

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
    }
  }
`

export const deleteBlogHeading = gql`
  mutation deleteBlogHeading(
    $id: ID!
  ) {
    deleteBlogHeading(
      id: $id
    )
  }
`
