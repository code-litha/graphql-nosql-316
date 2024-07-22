const books = [
  {
    id: 1,
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: 2,
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// type nya harus singular dan PascalCase
const typeDefs = `#graphql
  type Book {
    id: ID
    title: String
    author: String
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  # Query ini digunakan untuk MEMBACA DATA
  type Query {
    books: [Book]       # endpoint "books" mereturn array of Book
    getBooks: [Book]    # endpoint "getBooks" mereturn array of Book
    getBookById(bookId: ID): Book   # endpoint  "getBookById" meminta parameter "bookId" dengan type ID, yang mereturn Book
  }

  # Mutation ini digunakan untuk MENGUBAH / MEMANIPULASI DATA
  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`;


// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
// untuk melakukan fetching terhadap Query yang ada di dalam typeDefs
const resolvers = {
  Query: {
    books: () => {
      // fetch / ambil data books dari database
      return books
    },
    getBooks: () => {
      // fetch / ambil data books dari database
      return books
    },
    getBookById: (_parent, args) => {
      // console.log(args, '<<< args')
      const { bookId } = args
      const book = books.find(el => el.id == bookId)
      return book
    }
  },
  Mutation: {
    addBook: (_parent, args) => {
      const { title, author } = args

      const newBook = {
        id: 3,
        title,
        author
      }

      books.push(newBook)

      return newBook
    }
  }
};

module.exports = {
  bookTypeDefs: typeDefs,
  bookResolvers: resolvers
}