import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Game } from '../../../dto/Game';
import * as ioClient from 'socket.io-client';
import { GameEvent } from '../../../enums';

//const ioServerUrl = '/realtimegame';
const serverApi = '/api/game';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentUser: string;
  private socket: SocketIOClient.Socket;
  constructor(private http: HttpClient) { }

  initRealTimeApp(userName: string) {
    this.currentUser = userName;
    this.socket = ioClient({ query: { player: userName } });
    // this.socket.on(GameEvent.NewBattle, (player, defiant) => {
    //   console.log('player: ' +player);
    //   console.log('defiant: ' +defiant);
    // })
  }

  requestGame(defiant: string, opponent: string): Observable<Game> {
    let d = { defiant: defiant, opponent: opponent };
    return this.http.post<Game>(serverApi + '/request', d, httpOptions)
      .pipe(
        catchError(this.handleError<any>('requestGame'))
      );
  }

  startGame(gameId: number): Observable<Game> {
    return this.http.post<Game>(serverApi + '/start', { id: gameId }, httpOptions)
      .pipe(
        catchError(this.handleError<any>('startGame'))
      );
  }

  cancelGame(gameId: number): Observable<Game> {
    return this.http.post<Game>(serverApi + '/cancel', { id: gameId }, httpOptions)
      .pipe(
        catchError(this.handleError<any>('cancelGame'))
      );
  }
  endGame(gameId: number): Observable<Game> {
    return this.http.post<Game>(serverApi + '/end', { id: gameId }, httpOptions)
      .pipe(
        catchError(this.handleError<any>('endGame'))
      );
  }

  newGamesObserver() {
    let observable = new Observable(observer => {
      this.socket.on(GameEvent.NewBattle, (gameId, defiant, opponent) => {
        let game = { id: gameId, player1id: defiant, player2id: opponent } as Game;
        observer.next(game);
      });
    })
    return observable;
  }

  canceledGamesObserver() {
    let observable = new Observable(observer => {
      this.socket.on(GameEvent.CancelBattle, gameId => {
        observer.next(gameId);
      });
    })
    return observable;
  }

  openBattleFieldObserver() {
    let observable = new Observable(observer => {
      this.socket.on(GameEvent.OpenBattleField, (player1, player2) => {
        let opponent = player1 == this.currentUser ? player1 : player2;
        observer.next(opponent);
      });
    })
    return observable;
  }

  closeBattleFieldObserver() {
    let observable = new Observable(observer => {
      this.socket.on(GameEvent.CloseBattleField, (player1, player2) => {
        let ps = {player1, player2};
        observer.next(ps);
      });
    })
    return observable;
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
