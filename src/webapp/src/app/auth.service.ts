import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Player } from '../../../dto/Player';
import { MessageResult } from '../../../dto/MessageResult';

const serverApi = '/api/auth';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

let playerInfo: Player;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logInPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(serverApi, player, httpOptions)
      .pipe(
        tap(p => { playerInfo = p; }),
        catchError(this.handleError<any>('setAvailability'))
      );
  }

  logOutPlayer(player: Player): Observable<any> {
    return this.http.delete<any>(serverApi + '/' + player.name, httpOptions)
      .pipe(
        tap(p => { playerInfo = p; }),
        catchError(this.handleError<any>('setAvailability'))
      );
  }

  getPlayerInfo(): Player {
    return playerInfo;
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
