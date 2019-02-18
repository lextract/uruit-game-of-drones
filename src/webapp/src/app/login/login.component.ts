import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ViewType } from '../../../../enums';
import { Player } from '../../../../dto/Player';

@Component({
  selector: 'uruit-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  infoMessage: string = '';
  infoShowed: boolean = false;

  @Output() viewChanged = new EventEmitter<string>();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  loginClick() {
    this.infoShowed = false;
    this.authService.logInPlayer({ name: this.userName } as Player)
      .subscribe(player => {
        if (player.name) {
          this.viewChanged.emit(ViewType.Welcome);
        }
        else {
          this.infoMessage = 'User name not available';
          this.infoShowed = true;
        }
      })
  }

}
