import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'uruit-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  @Output() viewChanged = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  loginClick(){
    // TODO: verificar si el usuario está logedo actualmente
    this.viewChanged.emit('welcome');
  }

}
