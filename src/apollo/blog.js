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
      createdAt
      likes {
        id
      }
      user {
        id
        username
      }
      media {
        type
        url
        loadSequence
        caption
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
          childPosts {
            id
          }
          media {
            type
            url
            loadSequence
            caption
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
    $ItineraryId: ID!,
    $title: String,
    $textContent: String,
    $published: Boolean
  ) {
    updateBlog(
      id: $id,
      ItineraryId: $ItineraryId,
      title: $title,
      textContent: $textContent,
      published: $published
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
