import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GameService } from '../game.service';
import { Game } from '../../../../dto/Game';
import { ViewType } from '../../../../enums';

@Component({
  selector: 'uruit-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  userName: string = '';
  opponentName: string = '';
  connectingOpponent: boolean = false;
  battleRequests: any[] = [];

  requestedGames: Game[] = [];
  unavOppoHidden: boolean = true;
  @Output() viewChanged = new EventEmitter<string>();
  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.userName = this.authService.currentUser.name;
    this.gameService.initRealTimeApp(this.userName);
    this.gameService.requestGameDispatcher.subscribe(newGame => this.requestGameListener(newGame));
    this.gameService.cancelGameDispatcher.subscribe(gameId => this.cancelGameListener(gameId));
  }

  wantToPlayClick() {
    this.unavOppoHidden = true;
    this.gameService.requestGame(this.userName, this.opponentName)
  }
  requestGameListener(game: Game) {
    this.requestedGames.push(game);
  }
  cancelGame(gameId: number) {
    this.gameService.cancelGame(gameId);
  }
  cancelGameListener(gameId: number) {
    let idxGame: number;
    this.requestedGames.find((rg, idx) => {
      let r = rg.id == gameId;
      if (r) idxGame = idx;
      return r;
    });
    if (typeof idxGame == 'number')
      this.requestedGames.splice(idxGame, 1);
  }
  startGame(gameId: number) {
    this.gameService.startGame(gameId);
  }

  logOutClick() {
    this.viewChanged.emit(ViewType.Login);
    this.gameService.stopRealTimeApp();
    this.authService.logOutPlayer();
  }

}
