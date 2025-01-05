const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const AuthorSchema = require('./models/AuthorSchema')
const BookSchema = require('./models/BookSchema')
const { GraphQLError } = require('graphql')

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
      if(!args.author && !args.genre){
        const books = await BookSchema.find({}).populate('author')
        return books
      }
      if(args.genre && !args.author){
        const books = await BookSchema.find({ genres: { $in: [args.genre] } }).populate('author')
        return books
      }
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
    editAuthor: async (root, args) => {
      const author = await AuthorSchema.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        })
      }

      author.born = args.setBornTo

      try {
        await author.save()
      }
      catch (error) {
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