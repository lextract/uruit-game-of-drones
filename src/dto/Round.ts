import { Match } from './Match';

export class Round {
    id: number;
    player1id:string;
    player2id:string;
    player1Score: number;
    player2Score: number;
    totalMatches: number;
    matchesPlayed: number;
    matches: Match[];
}