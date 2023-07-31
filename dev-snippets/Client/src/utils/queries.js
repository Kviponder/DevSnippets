import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query GetMySnippets {
    me {
      snippets {
        _id
        code
        description
        language
        private
        tags
        title
        user {
          _id
          email
          password
          username
        }
      }
    }
  }
`;
