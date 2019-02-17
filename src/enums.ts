export enum GameEvent {
    NewBattle = 'NEW_BATTLE',
    OpenBattleField = 'OPEN_BATTLE_FIELD',
    CloseBattleField = 'CLOSE_BATTLE_FIELD',
    NotifyMatchResult = 'NOTIFY_MATCH_RESULT',
    NotifyWinner = 'NOTIFY_WINNER',
    //CancelBattle = 'CANCEL_BATTLE',
    RequestGame = 'REQUEST_GAME',
    CancelGame = 'CANCEL_GAME',
    StartGame = 'START_GAME',
    StopGame = 'STOP_GAME',
    NewMessage = 'NEW_MESSAGE',
    MakeMove = 'MAKE_MOVE'
}

export enum MoveType {
    Scissors = 'SCISSORS',
    Rock = 'ROCK',
    Paper = 'PAPER'
}
export enum ViewType {
    Login = 'logIn',
    Welcome = 'welcome',
    BattleField = 'battle-field'
}