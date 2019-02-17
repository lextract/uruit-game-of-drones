import { Match } from './Match';

export class Game {
    id: number;
    defiant:string;
    opponent:string;
    started: boolean;
    roundsIds: number[];
    currentMatch?: Match;
}