import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { GameService } from './game.service';
import { ViewType } from '../../../enums';
import { Message } from '../../../dto/Message';

@Component({
  selector: 'uruit-webapp',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  viewType: string = ViewType.Login;
  messages: Message[] = [];
  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {
    if (this.authService.currentUser)
      this.authService.logOutPlayer();
    this.authService.onPlayerLogged.subscribe(player => this.initSubscriptions());
  }

  onViewChanged(view: string) {
    this.viewType = view;
  }
  initSubscriptions() {
    console.log('inicializo siscribciones de app cmp');
    this.gameService.initRealTimeApp(this.authService.currentUser.name);
    this.gameService.startGameDispatcher.subscribe(game => this.viewType = ViewType.BattleField);
    this.gameService.stopGameDispatcher.subscribe(game => this.viewType = ViewType.Welcome);
    this.gameService.messageDispatcher.subscribe(message => this.messages.push(message));
  }
  dropSubscriptions() {

  }

  deleteMessage(msg: Message) {
    console.log('intentnaod borrar mesnsa app cmp');
    console.log(msg);
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i] == msg) {
        this.messages.splice(i, 1);
        break;
      }
    }
  }
}
