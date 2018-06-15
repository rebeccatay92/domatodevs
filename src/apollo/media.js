import { gql } from 'react-apollo'

/* ---------------------------- */
export const findMedium = gql`
  query findMedium($id: ID!) {
    findMedium(id: $id) {
      id
      type
      imageUrl
      youtubeUrl
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

export const createMedia = gql`
  mutation createMedia(
    $AlbumId: ID!,
    $media: [createMediaInput]!
  ) {
    createMedia(
      AlbumId: $AlbumId,
      media: $media
    )
  }
`

export const deleteMedia = gql`
  mutation deleteMedia($input: [ID]!) {
    deleteMedia(input: $input)
  }
`

export const moveMediaToAlbum = gql`
  mutation moveMediaToAlbum($AlbumId: ID!, $media: [ID]!) {
    moveMediaToAlbum(AlbumId: $AlbumId, media: $media)
  }
`
/* ---------------------------- */

export const createMediaPost = gql`
  mutation createMediaPost(
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

export const updateMediaPost = gql`
  mutation updateMediaPost(
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

export const deleteMediaPost = gql`
  mutation deleteMediaPost($id: ID!) {
    deleteMediaPost(id: $id)
  }
`

/* ---------------------------- */

export const reorderMediaPost = gql`
  mutation reorderMediaPost($input: [reorderMediaPostInput]) {
    reorderMediaPost(input: $input)
  }
`
