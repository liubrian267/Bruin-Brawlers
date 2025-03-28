export interface UserGameProfile {
  tag: string,
  name: string
  trophies: number,
  highestTrophies: number,
  club: {
    tag?: string,
    name?: string,
    
  },
  "3vs3Victories" : number,
    soloVictories: number,
    duoVictories: number
    bestRoboRumbleTime: number,
    bestTimeAsBigBrawler: number,
    brawlers: Brawler[]
}
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
  map: string;
}

export interface Game {
  battle: Battle;
  battleTime: string;
  event: Event;
}

export interface TeamListProp {
  team: Player[];
  starPlayer?: Player;
}

// This interface now exactly represents what the schema’s battleSession object holds.
export interface BattleSessionEntry {
  battles: Game[];
  totalBattles: number;
  totalWins: number;
  winRate: number;
  draws: number;
  totalTrophyChange: number;
  _id: string | null;
}

export type BattleSessionData = {
  [date: string]: BattleSessionEntry;
};


export interface MatchListProps {
  battleSession: { [date: string]: BattleSessionEntry };
}