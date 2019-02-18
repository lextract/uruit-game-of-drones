import { Socket } from 'socket.io';

export class Player {
    name: string;
    playing: boolean;
    socket: Socket;
}