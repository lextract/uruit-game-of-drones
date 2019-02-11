import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GameService } from '../game.service';
import { Game } from '../../../../dto/Game';

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
    this.userName = this.authService.getPlayerInfo().name;
    
    this.gameService.initRealTimeApp(this.userName);
    this.gameService.newGamesObserver().subscribe(newGame => {
      let game = newGame as Game;
      if (game.id) this.requestedGames.push(game);
    })
    this.gameService.canceledGamesObserver().subscribe(gameId => {
      let idxGame: number;
      this.requestedGames.find((rg, idx) => {
        let r = rg.id == gameId;
        if (r) idxGame = idx;
        return r;
      });
      if (typeof idxGame == 'number') 
        this.requestedGames.splice(idxGame, 1);
    })
    this.gameService.openBattleFieldObserver().subscribe(oponent => {
      this.viewChanged.emit('battle-field');
    })
  }

  wantToPlayClick() {
    //this.connectingOpponent = true;
    this.unavOppoHidden = true;
    this.gameService.requestGame(this.userName, this.opponentName)
      .subscribe(game => {
        if (game.id) this.requestedGames.push(game);
        else this.unavOppoHidden = false;
      })
  }
  cancelBattle(gameId: number) {
    this.gameService.cancelGame(gameId).subscribe();
  }
  startBattle(gameId: number) {
    this.gameService.startGame(gameId).subscribe();
  }

  logOutClick() {
    this.authService.logOutPlayer(this.authService.getPlayerInfo())
      .subscribe(p => {
        this.viewChanged.emit('logIn');
      })
  }

}
