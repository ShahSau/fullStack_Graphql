import { gql } from '@apollo/client'

export const GET_ALL_AUTHORS=gql`
   query {
     allAuthors  {
     name
     born
     }
   }
 `
export const GET_ALL_BOOKS=gql`
    query getAllBooks($genre: String) {
      allBooks(genre: $genre) {
        title
        published
        author {
          name
          born
        }
        genres
      }
  }
  `


export const CREATE_BOOK= gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published:$published,
      genres: $genres
    ) {
      title
      author {
        born
        name
      }
      published
    }
  }
`

export const SET_BIRTHYEAR=gql`
  mutation setBirthyear($name: String!, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born
    ) {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`