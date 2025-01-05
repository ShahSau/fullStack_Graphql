const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const AuthorSchema = require('./models/AuthorSchema')
const BookSchema = require('./models/BookSchema')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()


const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"]
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"]
  },  
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"]
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"]
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"]
  },
]


const typeDefs = `
    type Book{
        title: String!
        author: Author!
        published: Int!
        genres: [String!]!
    }
    
    type Author{
        name:String!
        born:Int
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        addAuthor(
            name:String!
            born:Int
        ): Author
        editAuthor(
            name:String!,
            setBornTo:Int!
        ): Author
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author:String, genre:String): [Book!]!
        allAuthors: [Author!]!
    }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await BookSchema.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await AuthorSchema.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      const books = await BookSchema.find({}).populate('author')
      return books
    },
    allAuthors: async () => {
      const authors = await AuthorSchema.find({})
      return authors
    }
  },
  Mutation:{
    addBook: async (root, args) => {
      const author = await AuthorSchema.findOne({ name: args.author })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          }
        })
      }

      const book = new BookSchema({ ...args, author: author })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      return book
    },
    // editAuthor:(root,args)=>{
    //     const author = authors.find(author => author.name === args.name)
    //     if(!author){
    //         return null
    //     }
    //     const updatedAuthor = {...author,born:args.setBornTo}
    //     authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
    //     return updatedAuthor
    // },
    addAuthor: async (root, args) => {
      const author = new AuthorSchema({ ...args })

      try {
          await author.save()
      } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
      }

      return author
      
    },
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})