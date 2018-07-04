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
      LocationId
      location {
        id
        verified
        name
        address
        latitude
        longitude
        country {
          id
          name
          code
        }
      }
      loadSequence
      title
      textContent
      eventType
      bucketCategory
      startDay
      startTime
      endTime
      currency
      cost
      bookingService
      media {
        id
        PostId
        MediumId
        loadSequence
        caption
        type
        AlbumId
        objectName
        imageUrl
        youtubeUrl
      }
      hashtags {
        id
        name
      }
    }
  }
`

export const createPost = gql`
  mutation createPost(
    $BlogId: ID!,
    $loadSequence: Int!,
    $title: String
  ) {
    createPost(
      BlogId: $BlogId,
      loadSequence: $loadSequence,
      title: $title
    ) {
      id
      loadSequence
      textContent
      title
      eventType
      bucketCategory
      startDay
      startTime
      endTime
      currency
      cost
      bookingService
      BlogId
      blog {
        id
        title
      }
      LocationId
      location {
        id
        name
        address
        verified
        latitude
        longitude
      }
      media {
        id
        AlbumId
        type
        objectName
        imageUrl
        youtubeUrl
        MediumId
        PostId
        loadSequence
        caption
      }
    }
  }
`

export const updatePost = gql`
  mutation updatePost(
    $id: ID!,
    $locationData: locationDataInput,
    $LocationId: ID,
    $loadSequence: Int,
    $title: String,
    $textContent: String,
    $eventType: String,
    $bucketCategory: String,
    $startDay: Int,
    $startTime: Int,
    $endTime: Int,
    $currency: String,
    $cost: Int,
    $bookingService: String,
    $hashtags: [String],
    $media: [updatePostMediaInput]
  ) {
    updatePost(
      id: $id,
      locationData: $locationData,
      LocationId: $LocationId,
      loadSequence: $loadSequence,
      title: $title,
      textContent: $textContent,
      eventType: $eventType,
      bucketCategory: $bucketCategory,
      startDay: $startDay,
      startTime: $startTime,
      endTime: $endTime,
      currency: $currency,
      cost: $cost,
      bookingService: $bookingService,
      hashtags: $hashtags,
      media: $media
    ) {
      id
    }
  }
`

// IS UPDATEMULTIPLE STILL NEEDED IF NO PARENT-CHILD POSTS?
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
