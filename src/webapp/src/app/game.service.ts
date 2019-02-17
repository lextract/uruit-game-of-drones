import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Game } from '../../../dto/Game';
import * as ioClient from 'socket.io-client';
import { GameEvent, MoveType } from '../../../enums';
import { Message } from '../../../dto/Message';
import { Match } from '../../../dto/Match';

//const ioServerUrl = '/realtimegame';
const serverApi = '/api/game';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {
  }

  private socket: SocketIOClient.Socket;
  private _currentGame: Game;
  private _requestGameDispatcher: Observable<Game>;
  private _startGameDispatcher: Observable<Game>;
  private _cancelGameDispatcher: Observable<number>;
  private _stopGameDispatcher: Observable<Game>;
  private _messageDispatcher: Observable<Message>;
  private _matchResultDispatcher: Observable<Match>;

  get currentGame() {
    return this._currentGame;
  }
  get requestGameDispatcher() {
    return this._requestGameDispatcher;
  }
  get cancelGameDispatcher() {
    return this._cancelGameDispatcher;
  }
  get startGameDispatcher() {
    return this._startGameDispatcher;
  }
  get stopGameDispatcher() {
    return this._stopGameDispatcher;
  }
  get messageDispatcher() {
    return this._messageDispatcher;
  }
  get matchResultDispatcher() {
    return this._matchResultDispatcher;
  }

  initRealTimeApp(userName: string) {
    if (this.socket)
      return;
    this.socket = ioClient({ query: { player: userName } });
    this._requestGameDispatcher = new Observable<Game>(observer => {
      this.socket.on(GameEvent.RequestGame, game => {
        observer.next(game);
      });
    });
    this._cancelGameDispatcher = new Observable<number>(observer => {
      this.socket.on(GameEvent.CancelGame, gameId => {
        observer.next(gameId);
      });
    });
    this._startGameDispatcher = new Observable<Game>(observer => {
      this.socket.on(GameEvent.StartGame, game => {
        this._currentGame = game;
        observer.next(game);
      });
    });
    this._stopGameDispatcher = new Observable<Game>(observer => {
      this.socket.on(GameEvent.StopGame, game => {
        this._currentGame = undefined;
        observer.next(game);
      });
    });
    this._messageDispatcher = new Observable<Message>(observer => {
      this.socket.on(GameEvent.NewMessage, message => {
        observer.next(message);
      });
    });
    this._matchResultDispatcher = new Observable<Match>(observer => {
      this.socket.on(GameEvent.NotifyMatchResult, match => {
        observer.next(match);
      });
    });
  }

  stopRealTimeApp(){
    this.socket.disconnect();
    this.socket = undefined;
  }

  requestGame(defiant: string, opponent: string) {
    this.socket.emit(GameEvent.RequestGame, opponent);
  }

  cancelGame(gameId: number) {
    this.socket.emit(GameEvent.CancelGame, gameId);
  }

  startGame(gameId: number) {
    this.socket.emit(GameEvent.StartGame, gameId);
  }

  stopGame() {
    this.socket.emit(GameEvent.StopGame, this.currentGame.id);
  }

  makeMove(moveType: MoveType) {
    this.socket.emit(GameEvent.MakeMove, this.currentGame.id, moveType);
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
