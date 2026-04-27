import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ChatComponent } from './features/chat/chat.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ChatComponent],
  imports: [FormsModule, HttpClientModule],
})
export class AppModule {}
