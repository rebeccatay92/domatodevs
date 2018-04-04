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

export const updatePost = gql`
  mutation updatePost(
    $id: ID!,
    $ParentPostId: ID,
    $loadSequence: Int,
    $googlePlaceData: googlePlaceData,
    $contentOnly: Boolean,
    $title: String,
    $textContent: String,
    $description: String,
    $eventType: String,
    $start: Boolean,
    $startDay: Int,
    $endDay: Int
  ) {
    updatePost(
      id: $id,
      ParentPostId: $ParentPostId,
      loadSequence: $loadSequence,
      googlePlaceData: $googlePlaceData,
      contentOnly: $contentOnly,
      title: $title,
      textContent: $textContent,
      description: $description,
      eventType: $eventType,
      start: $start,
      startDay: $startDay,
      endDay: $endDay
    )
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
