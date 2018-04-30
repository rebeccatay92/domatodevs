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
      published
      views
      shares
      likes {
        id
        username
      }
      title
      textContent
      days
      # pages {
      #   type
      #   modelId
      #   loadSequence
      #   BlogHeading {
      #     id
      #     loadSequence
      #     title
      #   }
      #   Post {
      #     id
      #     loadSequence
      #     title
      #   }
      # }
      hashtags {
        id
        name
      }
      media {
        id
        MediumId
        BlogId
        loadSequence
        caption
        AlbumId
        type
        objectName
        imageUrl
        youtubeUrl
      }
      createdAt
      updatedAt
      publishDate
    }
  }
`

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
        BlogId
        loadSequence
        caption
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
            loadSequence
          }
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
    $hashtags: [String],
    $media: [updateBlogMediaInput]
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
