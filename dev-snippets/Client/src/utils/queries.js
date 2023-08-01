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
    _id
    email
    username
  }
}
`;

export const LOGIN_USER = gql`
mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
    }
  }
}
`;