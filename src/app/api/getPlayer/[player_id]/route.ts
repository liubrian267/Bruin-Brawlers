import { NextApiRequest } from "next";
import { Redis } from'@upstash/redis';
import { connectToDatabase } from "@/utils/database";
import User from "@/models/User";

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  })
  
//can compress this into cache --> API --> database --> cache --> client

async function fetchPlayerFromAPI(player_id: string) {
  
  const fetchedUserData = await fetch(
    `https://api.brawlstars.com/v1/players/%23${player_id}/`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BS_API_KEY}`,
      },
    })
  if (!fetchedUserData.ok) {
    console.log("error", fetchedUserData)
    throw new Error("Failed to fetch user data");
  }
  return fetchedUserData.json()
}

async function fetchBattleLogFromAPI(player_id: string) {
  const fetchedBattleLogData = await fetch(
    `https://api.brawlstars.com/v1/players/%23${player_id}/battlelog`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BS_API_KEY}`,
      },
    })
  if (!fetchedBattleLogData.ok) {
    console.log("error", fetchedBattleLogData)
    throw new Error("Failed to fetch user data");
  }
  return fetchedBattleLogData.json()
}




export async function GET(req: NextApiRequest, { params }: { params: { player_id: string } }) {
  try{
    await connectToDatabase();
    const { player_id } = params;
    const user = await redis.get(player_id);
    
    //user found then return user
    if(user){
      return new Response(JSON.stringify(user), { status: 200 });
    }

    //check mongoDB for user
    const data = await fetchPlayerFromAPI(player_id);
    //const battleLogData = await fetchBattleLogFromAPI(player_id);
    console.log("data from player_id route", data)
    

    //find a way to store in the MongoDB
    const storedUser = await User.findOne({ BrawlID: player_id });
    if(!storedUser){
      return new Response(JSON.stringify({error: "User not found"}), { status: 404 });
    }

    //update the user in the MongoDB
    
    
    //store in cache


    //return the joined User data to be accessed by client
    

    console.log("response",data)

    

    return new Response(JSON.stringify(data), { status: 200 })
  } catch(error){
    //console.log(error)
    return new Response(JSON.stringify({error: error}), { status: 500 })
  }
}