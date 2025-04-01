# Bruin-Brawlers

This is a web app for the UCLA Brawl Stars Community! Share and discuss Brawl Stars-related content, track in-depth game analytics, and connect with fellow Bruin Brawlers to strategize, compete, and grow together.
## Getting Started

- Clone the repository : ```https://github.com/liubrian267/Bruin-Brawlers.git```.
- run ```npm instal``` to install dependencies
  
#### Setting up environment variables

create a .env file in root of project and include the following .env variables
along with each appropriate key

- MONGO_URI ={ Mongo DB URI }
- BS_API_KEY ={ BrawlStars API Key }
- JWT_SECRET = { json web token }

- Note that the brawl stars API key needs a specific IP address and does not allow general IP adress per API key. For any page if the contents are not being fetched, likely your ip address has changed and need to reconfigure your Brawl Stars API key
#### Running the server

to run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
### Overview of features available
<img width="1486" alt="Screen Shot 2025-03-12 at 10 50 15 PM" src="https://github.com/user-attachments/assets/3bb59ffb-a7ee-4b1f-8268-254909078ac1" />

### Connect with other Bruin Brawlers
<img width="1494" alt="Screen Shot 2025-03-12 at 11 15 50 PM" src="https://github.com/user-attachments/assets/8124c4af-036f-436c-b95b-5ad32e9dbea2" />

### View stats of any Users on the platform
- Win rate is tracked over time as users persist on the platform
- We plan on introducing more data analytics and a leaderboard exclusive to all users on this platform
<img width="1489" alt="Screen Shot 2025-03-12 at 11 18 07 PM" src="https://github.com/user-attachments/assets/0ac411fd-b9df-4156-b218-94d9c76e6176" />

- Match updates are recorded and tracked!
<img src="https://github.com/user-attachments/assets/b688db82-d7e2-4730-a7ae-123f89bb7525"/>

- Track games overtime organized by date and keep track of win rates
<img src="https://github.com/user-attachments/assets/265b961a-18b2-46b3-9519-fdb5c969b7c9"/>

### Stay competitive against fellow bruins in a up to date leaderboard!
<img src="https://github.com/user-attachments/assets/b7a010b5-3b26-4c90-b7a4-f3638d941b17"/>


### Detailed search for individual posts or fellow users
<img width="1487" alt="Screen Shot 2025-03-12 at 11 25 04 PM" src="https://github.com/user-attachments/assets/2c87185c-2f7c-498f-a653-103162e9949c" />

### Built with: 
[![Built With](https://skillicons.dev/icons?i=typescript,nextjs,mongodb,nodejs,react,tailwind)](https://skillicons.dev)


