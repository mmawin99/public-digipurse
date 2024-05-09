import { MongoClient, ServerApiVersion } from "mongodb";
const Crypto = require("crypto-js");
const mongoURI =
  "mongodb+srv://pursedigi:l94ZWpgBwnLexW0s@digipurseconnection.uw6y2t1.mongodb.net/?retryWrites=true&w=majority";

export default async function handler(req, res) {
  // Check if the request is from an allowed origin
  const allowedOrigins = [
    "http://localhost:3000",
    "https://pursify.mwn99.com",
    "https://digipurse.mwn99.com",
  ];
  const origin = req.headers.origin;

  if (
    !allowedOrigins.includes(origin) &&
    req.headers.host !== "localhost:3000"
  ) {
    return res.status(401).json({
      origin: origin,
      error: "Unauthorized access",
    });
  }

  const email = req.query.email; // Extract email from query parameters

  if (!email) {
    return res.status(400).json({
      error: "Email parameter is missing",
    });
  }

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

    const user = await collection.findOne({ email });

    const userStatus = user ? "premium" : "regular";

    const checkSum = Crypto.MD5(email + "_status_" + userStatus).toString();

    res.status(200).json({
      email,
      userStatus,
      checkSum
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
