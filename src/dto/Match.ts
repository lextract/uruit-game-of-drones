import { MoveType } from '../enums';

export class Match {
    roundId:number;
    player1move: MoveType;
    player2move: MoveType;
    winner: string;
}
