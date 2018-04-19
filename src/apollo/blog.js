import { gql } from 'react-apollo'

export const queryBlog = gql`
  query queryBlog($id: ID!) {
    findBlog(id: $id) {
      id
      title
      published
      textContent
      views
      shares
      days
      createdAt
      likes {
        id
      }
      user {
        id
        username
      }
      media {
        id
        type
        objectName
        imageUrl
        youtubeUrl
        loadSequence
        caption
      }
      hashtags {
        id
        name
      }
      pages {
        type
        modelId
        loadSequence
        BlogHeading {
          id
          title
        }
        Post {
          id
          textContent
          location {
            name
          }
          contentOnly
          ParentPostId
          title
          description
          eventType
          start
          startDay
          endDay
          startTime
          endTime
          childPosts {
            id
          }
          media {
            id
            type
            objectName
            imageUrl
            youtubeUrl
            loadSequence
            caption
          }
          hashtags {
            id
            name
          }
        }
      }
    }
  }`

export const increaseBlogViews = gql`
  mutation increaseBlogViews($id: ID!) {
    increaseBlogViews(id: $id)
  }
`

export const createBlog = gql`
  mutation createBlog(
    $UserId: ID!,
    $title: String,
    $textContent: String
  ) {
    createBlog(
      UserId: $UserId,
      title: $title,
      textContent: $textContent
    ) {
      id
      UserId
      title
      textContent
    }
  }
`

export const deleteBlog = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id)
  }
`

export const updateBlog = gql`
  mutation updateBlog(
    $id: ID!,
    $ItineraryId: ID,
    $title: String,
    $textContent: String,
    $days: Int,
    $published: Boolean,
    $hashtags: [String]!,
    $media: [updateBlogMediaInput]!
  ) {
    updateBlog(
      id: $id,
      ItineraryId: $ItineraryId,
      title: $title,
      textContent: $textContent,
      days: $days,
      published: $published,
      hashtags: $hashtags,
      media: $media
    ) {
      id
    }
  }
`

// either like or unlike
export const toggleBlogLikes = gql`
  mutation toggleBlogLikes(
    $BlogId: ID!,
    $UserId: ID!
  ) {
    toggleBlogLikes(
      BlogId: $BlogId,
      UserId: $UserId
    )
  }
`
