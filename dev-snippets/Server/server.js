
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Use Handlebars as the view engine with .handlebars extension
app.engine('.handlebars', exphbs.engine({
  extname: '.handlebars',
  helpers: {
    // Import the helpers from the handlebars-helpers.js file
  }
}));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


// Use the 'body-parser' middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/"));
});

app.use(express.static(path.join(__dirname, 'public')));

// Custom middleware to apply authMiddleware only to specific routes
const applyAuthMiddleware = (req, res, next) => {
  // Check if the request is for the GraphQL endpoint or any other route that requires authentication
  if (req.url === '/graphql' || req.url.startsWith('/api')) {
    // Apply authMiddleware to the request
    authMiddleware(req, res, next);
  } else {
    // For other requests, proceed to the next middleware
    next();
  }
};

// Use the custom middleware
app.use(applyAuthMiddleware);

// Register your routes
app.use(routes);


// Create a new instance of an Apollo server with the GraphQL schema and context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.user }), // Pass the user data to the Apollo server context
});

// Start the Apollo server
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
