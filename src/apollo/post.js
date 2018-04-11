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
        imageUrl
        youtubeUrl
        type
      }
      hashtags {
        name
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
        imageUrl
        youtubeUrl
        type
      }
    }
  }
`

export const updatePost = gql`
  mutation updatePost(
    $id: ID!,
    $ParentPostId: ID,
    $googlePlaceData: googlePlaceData,
    $LocationId: ID,
    $loadSequence: Int,
    $contentOnly: Boolean,
    $title: String,
    $textContent: String,
    $description: String,
    $eventType: String,
    $start: Boolean,
    $startDay: Int,
    $endDay: Int,
    $startTime: Int,
    $endTime: Int,
    $hashtags: [String]!
  ) {
    updatePost(
      id: $id,
      ParentPostId: $ParentPostId,
      googlePlaceData: $googlePlaceData,
      LocationId: $LocationId,
      loadSequence: $loadSequence,
      contentOnly: $contentOnly,
      title: $title,
      textContent: $textContent,
      description: $description,
      eventType: $eventType,
      start: $start,
      startDay: $startDay,
      endDay: $endDay,
      startTime: $startTime,
      endTime: $endTime,
      hashtags: $hashtags
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
