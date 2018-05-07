import { gql } from 'react-apollo'

export const changingLoadSequence = gql`
  mutation changingLoadSequence(
    $input: [changingLoadSequenceInput]
  ) {
    changingLoadSequence(input: $input)
  }
`
