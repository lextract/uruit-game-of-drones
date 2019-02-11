import { Round } from '../dto/Round';
import * as dal from '../dal/RoundDal'
import { Match } from '../dto/Match';

let roundsCache: Map<number, Round> = new Map();
let matchesCache: Map<number, Match> = new Map();

export function createRound(round: Round) {
    round.id = Math.random();
    roundsCache.set(round.id, round);
    return round.id;
}

export function saveRound(round: Round) {
    dal.createRound(round);
}

export function updateRound(round: Round) {

}

export function determineWinner() {
    
}

export function createMatch(match: Match){
    let id = Math.random();
    matchesCache.set(id, match);
    roundsCache
    return id;
}

export function deleteMatch(id: number){
    matchesCache.delete(id);
}

