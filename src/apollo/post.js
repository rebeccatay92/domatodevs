import { gql } from 'react-apollo'

export const findPost = gql`
  query findPost($id: ID!) {
    findPost(id: $id) {
      id
      BlogId
      Blog {
        id
        title
      }
      ParentPostId
      LocationId
      location {
        id
        name
      }
      loadSequence
      title
      description
      textContent
      contentOnly
      eventType
      start
      startDay
      endDay
      childPosts {
        id
        title
      }
      media {
        id
        url
        type
      }
    }
  }
`

export const createPost = gql`
  mutation createPost(
    $BlogId: ID!,
    $ParentPostId: ID,
    $loadSequence: Int!,
    $title: String
  ) {
    createPost(
      BlogId: $BlogId,
      ParentPostId: $ParentPostId,
      loadSequence: $loadSequence,
      title: $title
    ) {
      id
      loadSequence
      contentOnly
      textContent
      title
      description
      eventType
      start
      startDay
      endDay
      BlogId
      blog {
        id
        title
      }
      ParentPostId
      LocationId
      location {
        id
        name
      }
      childPosts {
        id
        title
      }
      media {
        id
        url
        type
      }
    }
  }
`

export const updatePost = gql`
  mutation updatePost(
    $id: ID!,
    $ParentPostId: ID,
    $LocationId: ID,
    $loadSequence: Int,
    $title: String,
    $textContent: String,
    $description: String,
    $contentOnly: Boolean,
    $eventType: String,
    $start: Boolean,
    $startDay: Int,
    $endDay: Int
  ) {
    updatePost(
      id: $id,
      ParentPostId: $ParentPostId,
      LocationId: $LocationId,
      loadSequence: $loadSequence,
      title: $title,
      textContent: $textContent,
      description: $description,
      contentOnly: $contentOnly,
      eventType: $eventType,
      start: $start,
      startDay: $startDay,
      endDay: $endDay
    ) {
      id
    }
  }
`

export const updateMultiplePosts = gql`
  mutation updateMultiplePosts(
    $input: [updateMultiplePostsInput]
  ) {
    updateMultiplePosts(
      input: $input
    )
  }
`

export const deletePost = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`
