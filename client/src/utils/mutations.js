import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
    mutation AddUserMutation(
        $username: String!
        $email: String!
        $password: String!
    ) {
        addUser(
        username: $username
        email: $email
        password: $password
        ) {
        token
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
        }
    }  
`;