import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  user: string;
  message: string;
  sentiment?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private zone: NgZone) {}
  private isConnecting = false;
  private hubConnection!: signalR.HubConnection;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  startConnection() {
    if (this.isConnecting || this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.isConnecting = true;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7124/chatHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (data) => {
      try {
        this.zone.run(() => {
          const newMessage: ChatMessage = {
            user: data.user ?? 'unknown',
            message: data.text ?? '',
            sentiment: data.sentiment,
            createdAt: data.createdAt,
          };

          this.messagesSubject.next([...this.messagesSubject.getValue(), newMessage]);
        });
      } catch (e) {
        console.error('Invalid message format', e);
      }
    });
    this.hubConnection
      .start()
      .then(() => console.log('CONNECTED'))
      .catch((err) => console.error(err));
  }

  async sendMessage(user: string, message: string) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn('❌ Not connected');
      return;
    }

    await this.hubConnection.invoke('SendMessage', user, message);
  }
}
