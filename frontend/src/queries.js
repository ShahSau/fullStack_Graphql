import { gql } from '@apollo/client'

export const GET_ALL_AUTHORS=gql`
   query {
     allAuthors  {
     name
     born
     bookCount
     }
   }
 `
export const GET_ALL_BOOKS=gql`
    query {
      allBooks {
      title
      author
      published
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
      author
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
