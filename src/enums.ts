export enum GameEvent {
    NewBattle = 'NEW_BATTLE',
    OpenBattleField = 'OPEN_BATTLE_FIELD',
    CloseBattleField = 'CLOSE_BATTLE_FIELD',
    NotifyMove = 'NOTIFY_MOVE',
    NotifyWinner = 'NOTIFY_WINNER',
    CancelBattle = 'CANCEL_BATTLE'
}

export enum MoveType {
    Scissors = 'SCISSORS',
    Rock = 'ROCK',
    Paper = 'PAPER'
}
export enum ViewType {
    Login = 'LOGIN',
    Welcome = 'WELCOME',
    BattleField = 'BATTLE_FIELD'
}