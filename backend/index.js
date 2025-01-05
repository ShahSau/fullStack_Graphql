const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const AuthorSchema = require('./models/AuthorSchema')
const BookSchema = require('./models/BookSchema')
const UserSchema = require('./models/UserSchema')
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

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
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
        createUser(
          username: String!
          favoriteGenre: String!
        ): User
        login(
          username: String!
          password: String!
        ): Token
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author:String, genre:String): [Book!]!
        allAuthors: [Author!]!
        me: User
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
    },
    me: (root,args,context)=>{
      return context.currentUser
    }
  },
  Mutation:{
    addBook: async (root, args, context) => {

      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
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
    editAuthor: async (root, args,context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
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
    addAuthor: async (root, args,context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
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
    createUser: async (root, args) => {
      const user = new UserSchema({ ...args })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }

      return user
    },
    login: async (root, args) => {
      const user = await UserSchema.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
   },
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await UserSchema
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})