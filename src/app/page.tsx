import React from "react";
import { connectToDatabase } from "@/utils/database";
import Hero from "../components/homePage/Hero";
import Features from "../components/homePage/Features";

/*
Deciding structure of application: 
  - Seperate page for login before users can access the app
  - Seperate page for home dashboard
    - friends sidebar
    - recommended friends
    - upcoming tournaments
  - Seperate page for creating tournaments

Components: 
  - Friends sidebar
  - Tournament Card
  - Friend Card
  - Tournament Creation Form
  - Search bar (tournements, friends)
  - 

Authentication: 
  - Using MongoDB? for storing data 
  - Using JWT for authentication (cookies?)
  - Using bcrypt for password hashing 
  - User must be authenticated before accessing any page
  - Middleware ? 

Server Actions: 
  - Fetching user data
  - Fetching tournament data
  - Fetching friends data
  - Creating tournament
  - Joining tournament

Database Schemas: 
  - Users
    - id 
    - username
    - friends
    - tournaments
    - brawl stars data can be fetched from api each time 


  - Event
    - id string
    - name string
    - date string
    - public or private bool
    - participant IDs []
    - further brawl stars specific data (rank, brawlers allowed, etc)

  - 
*/
const home = () => {
  connectToDatabase();
  return (
    <main className="min-h-screen bg-gradient-to-br from-ucla-blue to-ucla-gold h-full w-full">
      <div className="container mx-auto px-4 py-8">
        <Hero />
        <Features />
      </div>
      <div className="absolute inset-0 bg-brawl-pattern opacity-10 pointer-events-none"></div>
    </main>
  );
};

export default home;
