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
