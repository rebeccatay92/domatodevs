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
        name
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
