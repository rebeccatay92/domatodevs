import { gql } from 'react-apollo'

export const findBlogHeading = gql`
  findBlogHeading($id: ID!) {
    findBlogHeading(id: $id) {
      id
      BlogId
      loadSequence
      title
    }
  }
`

export const createBlogHeading = gql`
  createBlogHeading(
    $BlogId: ID!,
    $loadSequence: Int!,
    $title: String!
  ) {
    createBlogHeading(
      BlogId: $BlogId,
      loadSequence: $loadSequence,
      title: $title
    ) {
      id
      BlogId
      loadSequence
      title
    }
  }
`
export const updateBlogHeading = gql`
  updateBlogHeading(
    $id: ID!,
    $loadSequence: Int,
    $title: String
  ) {
    updateBlogHeading(
      id: $id,
      loadSequence: $loadSequence,
      title: $title
    ) {
      id
    }
  }
`

export const deleteBlogHeading = gql`
  deleteBlogHeading($id: ID!) {
    deleteBlogHeading(id: $id)
  }
`
