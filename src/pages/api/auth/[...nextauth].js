import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from 'next-auth/providers/google'
import Auth0Provider from 'next-auth/providers/auth0'
import LineProvider from 'next-auth/providers/line'
import authorizeNextAuthToFirebase from "@/firebase/auth/authorizeNextAuthToFirebase"
import { MongoClient, ServerApiVersion } from "mongodb"
// import { CryptoJS } from 'crypto-js';

const mongoURI = "mongodb+srv://pursedigi:l94ZWpgBwnLexW0s@digipurseconnection.uw6y2t1.mongodb.net/?retryWrites=true&w=majority";
const Crypto = require("crypto-js");
export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  // Configure one or more authentication providers
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    colorScheme: "auto"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Auth0Provider({
    //   clientId: process.env.AUTH_AUTH0_ID,
    //   clientSecret: process.env.AUTH_AUTH0_SECRET,
    //   issuer: process.env.AUTH_AUTH0_ISSUER
    // }),
    LineProvider({
      scope: 'profile openid email',
      params: {
        grant_type: 'authorization_code'
      },
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.settings = account;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.settings = token;
      const EncodeEmailPassword = Crypto.MD5(session.user.email).toString();
      session.uniqueEncodeEmail = EncodeEmailPassword
      const email = session.user.email;
      const client = new MongoClient(mongoURI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      try {
        await client.connect();
        const database = client.db("dppr_status");
        const collection = database.collection("user");

        const userFromDB = await collection.findOne({ email });
        const userStatus = userFromDB ? "premium" : "regular";
        const checkSum = Crypto.MD5(email + "_status_" + userStatus).toString();
        session.user.statusUser = userStatus;
        session.user.premiumInformation  = userFromDB;
        session.user.checkSum = checkSum;
      } catch (error) {
        console.error("Error:", error);
      } finally {
        await client.close();
      }

      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/singin', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
}
export default NextAuth(authOptions)
