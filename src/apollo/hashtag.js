import { gql } from 'react-apollo'

export const getAllHashtags = gql`
  query {
    getAllHashtags {
      id
      name
    }
  }
`

export const findHashtag = gql`
  query findHashtag($id: ID!) {
    findHashtag(id: $id) {
      id
      name
      taggedBlogs {
        id
        title
      }
      taggedPosts {
        id
        title
      }
    }
  }
`

export const createHashtagBlog = gql`
  mutation createHashtagBlog(
    $BlogId: ID!
    $name: String!
  ) {
    createHashtagBlog(
      BlogId: $BlogId,
      name: $name
    ) {
      id
      BlogId
      HashtagId
    }
  }
`

export const createHashtagPost = gql`
  mutation createHashtagPost(
    $PostId: ID!
    $name: String!
  ) {
    createHashtagPost(
      PostId: $PostId,
      name: $name
    ) {
      id
      PostId
      HashtagId
    }
  }
`

export const deleteHashtagBlog = gql`
  mutation deleteHashtagBlog($id: ID!) {
    deleteHashtagBlog(id: $id)
  }
`

export const deleteHashtagPost = gql`
  mutation deleteHashtagPost($id: ID!) {
    deleteHashtagPost(id: $id)
  }
`
