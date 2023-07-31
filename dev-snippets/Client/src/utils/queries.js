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

export const ADD_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    email
    password
    username
  }
}
`;