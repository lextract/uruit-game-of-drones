import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'uruit-battle-field',
  templateUrl: './battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})
export class BattleFieldComponent implements OnInit {

  opponentName: string;
  matchResult: string;
  playing: boolean = true;
  rounds
  @Output() viewChanged = new EventEmitter<string>();

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.gameService.closeBattleFieldObserver().subscribe(oponent => {
      this.viewChanged.emit('welcome');
    })
  }

  endBattleClick(){
    this.gameService.endGame(1).subscribe();
    //this.viewChanged.emit('welcome');
  }

}
