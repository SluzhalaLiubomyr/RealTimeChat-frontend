import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  messages$!: any;

  user = '';
  message = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.startConnection();

    this.messages$ = this.chatService.messages$;
  }

  send() {
    if (!this.user || !this.message) {
      alert('User and message are required');
      return;
    }

    this.chatService.sendMessage(this.user, this.message);
    this.message = '';
  }
}
