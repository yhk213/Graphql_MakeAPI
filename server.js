import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2"
  },
  {
    id: "2",
    text: "second one",
    userId: "1"
  },
];

let users = [
  {
    id: "1",
    firstName: "Younghae",
    lastName: "Kim"
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask"
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """ 
  Tweet object represents a resource for a Tweet  
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
const resolvers = {
  Query: {
    allUsers(){
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({firstName, lastName}) {
      // console.log(id);
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: { 
    author({userId}){
      return users.find(user => user.id === userId);
    }
  }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
