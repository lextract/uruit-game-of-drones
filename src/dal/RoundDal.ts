import { Round } from '../dto/Round';

let tempCollec = new Map();

export function createRound(round: Round) {
    tempCollec.set(round.id, {
        id: round.id,
        player1id: round.player1id,
        player2id: round.player2id,
        player1Score: round.player1Score,
        player2Score: round.player2Score,
        totalMatches: round.totalMatches
    });
    return round.id;
}

export function getRound(id: number): Round {
    let r = tempCollec.get(id);
    return <Round>r;
}

export function updateRound(round: Round) {
    let r = <Round>tempCollec.get(round.id);
    if (r) {
        r.matchesPlayed = round.matchesPlayed;
        r.player1Score = round.player1Score;
        r.player2Score = round.player2Score;
    }
}

export function getRoundsByPlayer(playerId: string): Round[] {
    let rounds = [];
    tempCollec.forEach((key,value)=>{
        if (value.player1id == playerId || value.player2id == playerId)
        rounds.push(value);
    });
    return <Round[]>rounds;
}