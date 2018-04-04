import { gql } from 'react-apollo'

/* ---------------------------- */
export const findMedium = gql`
  query findMedium($id: ID!) {
    findMedium(id: $id) {
      id
      url
      type
    }
  }
`

export const findMediaBlog = gql`
  query findMediaBlog($id: ID!) {
    findMediaBlog(id: $id) {
      id
      MediaId
      BlogId
      loadSequence
      caption
    }
  }
`

export const findMediaPost = gql`
  query findMediaPost($id: ID!) {
    findMediaPost(id: $id) {
      id
      MediaId
      PostId
      loadSequence
      caption
    }
  }
`
/* ---------------------------- */

export const createMedium = gql`
  mutation createMedium(
    $url: String!
    $type: String!
  ) {
    createMedium(
      url: $url,
      type: $type
    ) {
      id
      url
      type
    }
  }
`

export const deleteMedium = gql`
  mutation deleteMedium($id: ID!) {
    deleteMedium(id: $id)
  }
`
/* ---------------------------- */

export const createMediaBlog = gql`
  createMediaBlog(
    $MediumId: ID!,
    $BlogId: ID!,
    $loadSequence: Int!,
    $caption: String
  ) {
    createMediaBlog(
      MediumId: $MediumId,
      BlogId: $BlogID,
      loadSequence: $loadSequence,
      caption: $caption
    ) {
      id
      MediumId
      BlogId
      loadSequence
      caption
    }
  }
`

export const createMediaPost = gql`
  createMediaPost(
    $MediumId: ID!,
    $PostId: ID!,
    $loadSequence: Int!,
    $caption: String
  ) {
    createMediaPost(
      MediumId: $MediumId,
      PostId: $PostId,
      loadSequence: $loadSequence,
      caption: $caption
    ) {
      id
      MediumId
      PostId
      loadSequence
      caption
    }
  }
`

export const updateMediaBlog = gql`
  updateMediaBlog(
    $id: ID!,
    $loadSequence: Int,
    $caption: String
  ) {
    updateMediaBlog(
      id: $id,
      loadSequence: $loadSequence,
      caption: $caption
    ) {
      id
    }
  }
`

export const updateMediaPost = gql`
  updateMediaPost(
    $id: ID!,
    $loadSequence: Int,
    $caption: String
  ) {
    updateMediaPost(
      id: $id,
      loadSequence: $loadSequence,
      caption: $caption
    ) {
      id
    }
  }
`

export const deleteMediaBlog = gql`
  deleteMediaBlog($id: ID!) {
    deleteMediaBlog(id: $id)
  }
`

export const deleteMediaPost = gql`
  deleteMediaPost($id: ID!) {
    deleteMediaPost(id: $id)
  }
`

/* ---------------------------- */

export const reorderMediaBlog = gql`
  reorderMediaBlog($input: [reorderMediaBlogInput]) {
    reorderMediaBlog(input: $input)
  }
`

export const reorderMediaPost = gql`
  reorderMediaPost($input: [reorderMediaPostInput]) {
    reorderMediaPost(input: $input)
  }
`
