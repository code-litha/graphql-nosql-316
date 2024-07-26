import { gql } from "@apollo/client";

export const MUTATION_REGISTER = gql`
  mutation Register($payload: RegisterInput) {
    register(payload: $payload) {
      _id
      username
      email
      password
    }
  }
`;

export const MUTATION_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      token
    }
  }
`;
