import { gql } from 'react-apollo'

export const deleteMultipleEvents = gql`
  mutation deleteMultipleEvents(
    $input: [ID]
  ) {
    deleteMultipleEvents(input: $input)
  }
`
