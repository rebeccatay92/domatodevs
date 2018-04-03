import { gql } from 'react-apollo'

export const createPost = gql`
  mutation createPost(
    $BlogId: ID!,
    $ParentPostId: ID,
    $loadSequence: Int!
  ) {
    createPost(
      BlogId: $BlogId,
      ParentPostId: $ParentPostId,
      loadSequence: $loadSequence
    ) {
      id
    }
  }
`

export const deletePost = gql`
  mutation deletePost(
    $id: ID!
  ) {
    deletePost(
      id: $id
    )
  }
`
