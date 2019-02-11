import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

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
    this.authService.logInPlayer({ name: this.userName })
      .subscribe(player => {
        if (player.name) {
          this.viewChanged.emit('welcome');
        }
        else {
          this.infoMessage = 'User name not available';
          this.infoShowed = true;
        }
      })
  }

}
