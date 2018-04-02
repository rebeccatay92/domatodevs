import { gql } from 'react-apollo'

export const reorderBlogContent = gql`
  mutation reorderBlogContent(
    $type: String!,
    $modelId: ID!,
    $loadSequence: Int!
  ) {
    reorderBlogContent(
      type: $type,
      modelId: $modelId,
      loadSequence: $loadSequence
    )
  }
`
