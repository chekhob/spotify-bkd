import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getTopTracks, refreshAccessToken} from "./func.ts";

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

let access_token: string | undefined;
let refresh_token: string | undefined; 
// Get environment variables
dotenv.config()

// Create the express server and configure it to use json
const app = express();
app.use(express.json());

// Configure cors policy
app.use(cors());
// app.use(async (req, res, next)=>{
//   if(!token){
//     const client_id = process.env.CLIENT_ID;
//     const client_secret = process.env.CLIENT_SECRET;
//     if (!client_id || !client_secret) {
//       throw new Error('Missing CLIENT_ID or CLIENT_SECRET in environment variables');
//     }
//     token = await getWebToken(client_id, client_secret);
//   }
//   next();
// });

app.get("/", (req, res) =>{
 res.send("Hi");
})
app.get('/initial-auth', async(req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.CLIENT_ID!,
    scope: 'user-top-read',
    redirect_uri: process.env.REDIRECT_URI!,
  });
  
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

app.get('/callback', async (req, res) => {
  console.log({req: req.body});
  res.send('Everythign is okay');
});

// Set up a API call with GET method
app.get('/data', async (req, res) => {
  // Return some sample data as the response
  try {
    // const toptracks: object = await getTopTracks(access_token);
    const toptracks: object = {};
    console.log({toptracks});
    res.json(toptracks);
  }
  catch (error) {
    console.log({ error });
    res.status(501).json({ error });
  }
});


// Start the server on port configured in .env (recommend port 8000)
app.listen(3000, () => {
  console.log(`SERVER IS RUNNING AT PORT ${3000}`);
});


process.on('exit', (code) => console.log(`👋 Process exiting with code ${code}`));
process.on('SIGTERM', () => console.log("🛑 SIGTERM received"));
process.on('SIGINT', () => console.log("🛑 SIGINT received"));

