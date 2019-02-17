import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { AuthService } from '../auth.service';
import { MoveType } from '../../../../enums';

@Component({
  selector: 'uruit-battle-field',
  templateUrl: './battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})
export class BattleFieldComponent implements OnInit {
  playerName: string;
  opponentName: string;
  matchResult: string;
  playing: boolean = true;
  pPicked: boolean;
  rPicked: boolean;
  sPicked: boolean;
  pPickedOpp: boolean;
  rPickedOpp: boolean;
  sPickedOpp: boolean;
  totalMatches: number = 0;
  player1wins: number = 0;
  player2wins: number = 0;
  showtNextMatch: boolean;
  currentMove: MoveType;
  //rounds
  @Output() viewChanged = new EventEmitter<string>();

  constructor(
    private gameService: GameService,
    private authService: AuthService
  ) {
    this.playerName = this.authService.currentUser.name;
    if (this.gameService.currentGame.defiant == this.authService.currentUser.name)
      this.opponentName = this.gameService.currentGame.opponent;
    else this.opponentName = this.gameService.currentGame.defiant;
    //this.gameService.stopGameDispatcher.subscribe(game => this.viewChanged)

  }

  ngOnInit() {
    // this.gameService.closeBattleFieldObserver().subscribe(oponent => {
    //   this.viewChanged.emit('welcome');
    // })
    this.gameService.matchResultDispatcher.subscribe(match => {
      console.log('match recibido');
      console.log(match);
      this.showtNextMatch = true;
      this.totalMatches += 1;
      if (match.winner == this.playerName)
        this.player1wins += 1;
      if (match.winner == this.opponentName)
        this.player1wins += 1;
      if (match.player1move == match.player2move){
        this.pickMoveOpponent(match.player2move);
      }
      else if (match.player1move == this.currentMove) {
        this.pickMoveOpponent(match.player2move);
      }
      else this.pickMoveOpponent(match.player1move);
        
    })
  }

  pickMove(movement: string) {
    if (this.showtNextMatch) return;
    this.pPicked = false;
    this.rPicked = false;
    this.sPicked = false;
    switch (movement) {
      case 'P':
        this.pPicked = true;
        this.currentMove = MoveType.Paper;
        break;
      case 'R':
        this.rPicked = true;
        this.currentMove = MoveType.Rock;
        break;
      case 'S':
        this.sPicked = true;
        this.currentMove = MoveType.Scissors;
        break;
    }
    this.gameService.makeMove(this.currentMove);
  }

  private pickMoveOpponent(moveType: MoveType) {
    switch (moveType) {
      case MoveType.Paper:
      this.pPickedOpp = true;
      break;
      case MoveType.Rock:
      this.rPickedOpp = true;
      break;
      case MoveType.Scissors:
      this.sPickedOpp = true;
      break;
    }
  }

  nextMatch() {
    this.pPicked = false;
    this.rPicked = false;
    this.sPicked = false;
    this.pPickedOpp = false;
    this.rPickedOpp = false;
    this.sPickedOpp = false;
    this.showtNextMatch = false;
  }

  endBattleClick() {
    this.gameService.stopGame();
    //this.viewChanged.emit('welcome');
  }

}
