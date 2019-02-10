import { Component } from '@angular/core';

@Component({
  selector: 'uruit-webapp',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  userName: string = '';
  loggedIn: boolean = false;
  viewType: string = 'logIn';

  onViewChanged(view: string){
    this.viewType= view;
  }
}
