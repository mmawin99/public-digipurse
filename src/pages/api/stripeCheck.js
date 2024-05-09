import { MongoClient, ServerApiVersion } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mongoURI =
  "mongodb+srv://pursedigi:l94ZWpgBwnLexW0s@digipurseconnection.uw6y2t1.mongodb.net/?retryWrites=true&w=majority";

export default async function handler(req, res) {
  const client = new MongoClient(mongoURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.body.session);

      if (session.payment_status === "paid") {
        await client.connect();
        const database = client.db("dppr_status");
        const collection = database.collection("user");

        // Add a unique index on the email field
        await collection.createIndex({ email: 1 }, { unique: true });

        // Attempt to insert the document, catch duplicate key errors
        try {
          await collection.insertOne({
            email: req.body.email,
            payment_session: req.body.session,
            payment_date: new Date().getTime(),
          });
          // res.status(200).json({ status: true, code: "001", msg: "Payment successfully." });
        } catch (error) {
          // Check if the error is a duplicate key error (code 11000)
          if (error.code === 11000) {
            client.close();
            res.status(200).json({
              status: true,
              code: "002",
              msg: "Payment successfully.",
            });
          } else {
            // If it's not a duplicate key error, handle the error accordingly
            throw error;
          }
        } finally {
          await client.close();
        }
        res.status(200).json({ status: true, code: "001", msg: "Payment successfully." });
      } else {
        res.status(200).json({ status: false, code: "003", msg: "Payment under process." });
      }
    } catch (err) {
      res.status(200).json({
        status: false,
        method:req.method,
        code: "004",
        msg: "Error checking session",
        errortext: err,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(200).json({
      status: false,
      method:req.method,
      code: "005",
      msg: "Method not allowed"
    });
  }
}