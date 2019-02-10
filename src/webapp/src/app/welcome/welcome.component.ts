import { Component, Output, EventEmitter, OnInit } from '@angular/core';

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
  @Output() viewChanged = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    this.battleRequests.push({userName:'pepito'});
  }

  wantToPlayClick(){
    this.connectingOpponent = true;
  }
  cancelRequestClick(){
    this.connectingOpponent = false;
  }
  acceptBattle(userName: string){
    console.log(userName);
  }

  logOutClick(){
    
    this.viewChanged.emit('logIn');
  }

}
