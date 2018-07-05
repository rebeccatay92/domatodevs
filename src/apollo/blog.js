import { gql } from 'react-apollo'

export const getAllPublishedBlogs = gql`
  query getAllPublishedBlogs {
    getAllPublishedBlogs {
      id
      UserId
      user {
        id
        username
        profilePic
      }
      title
      days
      hashtags {
        id
        name
      }
      medium {
        id
        type
        objectName
        imageUrl
        youtubeUrl
      }
      published
      views
      shares
      likes {
        id
        username
      }
      # eg 10th april 2018
      publishDate
      # eg 2 hrs ago
      timeFromPublishDate
      createdAt
      updatedAt
    }
  }
`

export const getUserBlogs = gql`
  query getUserBlogs {
    getUserBlogs {
      id
      title
      published
      views
      publishDate
      timeFromPublishDate
      medium {
        id
        imageUrl
      }
      hashtags {
        id
        name
      }
    }
  }
`

export const queryBlog = gql`
  query queryBlog($id: ID!) {
    findBlog(id: $id) {
      id
      title
      published
      views
      shares
      days
      likes {
        id
      }
      createdAt
      updatedAt
      user {
        id
        username
      }
      medium {
        id
        type
        objectName
        imageUrl
        youtubeUrl
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
          medium {
            id
            imageUrl
          }
        }
        Post {
          id
          textContent
          location {
            name
          }
          title
          currency
          cost
          bookingService
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
            loadSequence
            caption
            PostId
            MediumId
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
    $title: String
  ) {
    createBlog(
      UserId: $UserId,
      title: $title
    ) {
      id
      UserId
      title
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
    $days: Int,
    $published: Boolean,
    $hashtags: [String],
    $MediumId: ID
  ) {
    updateBlog(
      id: $id,
      ItineraryId: $ItineraryId,
      title: $title,
      days: $days,
      published: $published,
      hashtags: $hashtags,
      MediumId: $MediumId
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
