import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { Player } from '../../../dto/Player';


const serverApi = '/api/auth';
const AUTH_KEY = "authetication_token";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser: Player;
  private _onPlayerLogged: Observable<Player>;
  get onPlayerLogged() {
    return this._onPlayerLogged;
  }
  private notifyPlayerLogged: (player: Player) => void;

  constructor(private http: HttpClient) {
    if (!this._currentUser) {
      let authKey = window.sessionStorage.getItem(AUTH_KEY);
      if (authKey) {
        this._currentUser = { name: authKey } as Player;
      }
    }
    this._onPlayerLogged = new Observable<Player>(observer => {
      this.notifyPlayerLogged = (player: Player) => {
        observer.next(player);
      }
    }).pipe(share());
  }



  get currentUser() {
    return this._currentUser;
  }

  logInPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(serverApi, player, httpOptions)
      .pipe(
        tap(p => {
          window.sessionStorage.setItem(AUTH_KEY, p.name);
          this._currentUser = p;
          this.notifyPlayerLogged(p);
        }),
        catchError(this.handleError<any>('setAvailability'))
      );
  }

  logOutPlayer(): Observable<any> {
    window.sessionStorage.removeItem(AUTH_KEY);
    let r = this.http.delete<any>(serverApi + '/' + this.currentUser.name, httpOptions)
      .pipe(
        catchError(this.handleError<any>('setAvailability'))
      );
    this._currentUser = undefined;
    return r;
  }





  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`HeroService: ${message}`);
  }
}
