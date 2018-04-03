import { gql } from 'react-apollo'

export const reorderBlogContent = gql`
  mutation reorderBlogContent(
    $input: [reorderBlogContentInput]
  ) {
    reorderBlogContent(input: $input)
  }
`
