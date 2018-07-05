import { gql } from 'react-apollo'

// depends on context
export const getUserBucketList = gql`
  query getUserBucketList {
    getUserBucketList {
      buckets {
        id
        UserId
        LocationId
        location {
          id
          verified
          name
          address
          latitude
          longitude
          CountryId
          country {
            id
            name
            code
          }
        }
        notes
        eventType
        bucketCategory
        thumbnailUrl
        visited
      }
      countries {
        id
        name
        code
      }
    }
  }
`

export const findBucket = gql`
  query findBucket($id: ID!) {
    findBucket(id: $id) {
      id
      UserId
      LocationId
      location {
        id
        verified
        name
        address
        latitude
        longitude
      }
      notes
      eventType
      bucketCategory
      thumbnailUrl
      visited
    }
  }
`

export const createBucket = gql`
  mutation createBucket(
    # $UserId: ID!,
    $LocationId: ID!,
    $bucketCategory: String,
    $eventType: String,
    $notes: String,
    $thumbnailUrl: String
  ) {
    createBucket(
      # UserId: $UserId,
      LocationId: $LocationId,
      bucketCategory: $bucketCategory,
      eventType: $eventType,
      notes: $notes,
      thumbnailUrl: $thumbnailUrl
    ) {
      id
      UserId
      LocationId
      location {
        id
        verified
        name
        address
        latitude
        longitude
      }
      eventType
      bucketCategory
      notes
      thumbnailUrl
    }
  }
`

export const updateBucket = gql`
  mutation updateBucket(
    $id: ID!,
    $bucketCategory: String,
    $eventType: String,
    $notes: String,
    $thumbnailUrl: String,
    $visited: Boolean
  ) {
    updateBucket(
      id: $id,
      bucketCategory: $bucketCategory,
      eventType: $eventType,
      notes: $notes,
      thumbnailUrl: $thumbnailUrl,
      visited: $visited
    ) {
      id
      UserId
      LocationId
      location {
        id
        verified
        name
        address
        latitude
        longitude
      }
      eventType
      bucketCategory
      notes
      thumbnailUrl
    }
  }
`

export const deleteBucket = gql`
  mutation deleteBucket($id: ID!) {
    deleteBucket(id: $id)
  }
`
