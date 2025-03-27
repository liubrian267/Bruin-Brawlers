// Using PascalCase for interface names as per TypeScript conventions
export interface Brawler {
    id: number;
    name: string;
    power: number;
    rank?: number;
    trophies: number;
  }
  
  export interface BrawlerListProps {
    brawlers: Brawler[];
  }
  
  export interface Battle {
    mode: string; // e.g., 'brawlBall'
    type: string; // e.g., 'ranked'
    result: string; // e.g., 'victory'
    duration: number; // duration in seconds (or another unit)
    trophyChange: number;
    starPlayer?: Player;
    teams?: Player[][]; // array of arrays of player objects
    // Add any additional battle attributes here
    players?: Player[];
  }
  
  export interface Player {
    tag: string;
    name: string;
    brawler: Brawler;
    brawlers?: Brawler[];
  }
  
  export interface Event {
    id: number;
    mode: string; // e.g., 'brawlBall5V5'
    map: string; // e.g., 'Suspenders'
    // Add any additional event attributes here
  }
  
  export interface Game {
    battle: Battle;
    battleTime: string;
    event: Event;
  }
  

  export interface TeamListProp {
    team: Player[]
    starPlayer?: Player;
  }


  // in typescript, props are passed as an object with a property "battleSession" that contains these attributes
export interface BattleSessionData {
  battles: Game[];
  totalBattles: number;
  totalWins: number;
  winRate: number;
}

export interface MatchListProps {
  battleSession: { [date: string]: BattleSessionData };
}