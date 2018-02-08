import { gql } from 'react-apollo'

export const deleteMultipleEvents = gql`
  mutation deleteMultipleEvents(
    $input: [EventsToBeDeleted]
  ) {
    deleteMultipleEvents(input: $input)
  }
`
