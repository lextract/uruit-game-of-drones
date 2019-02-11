import { Match } from './Match';

export class Game {
    id: number;
    player1id:string;
    player2id:string;
    started: boolean;
    roundsIds: number[];
    currentMatch?: Match;
}