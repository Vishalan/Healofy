import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '',liked_count:0,liked_by:[] };
  socket = io('http://localhost:4000');

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user!==null) {
      this.getChatByRoom(user.room);
      this.msgData = { room: user.room, nickname: user.nickname, message: '',liked_count:0,liked_by:[] }
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '',liked_count:0,liked_by:[] }
        this.scrollToBottom();
      }
    }.bind(this));
    this.socket.on('old-message', function (data) {
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        for (var i = 0; i < this.chats.length; i++) {
          if (String(this.chats[i]._id) === String(data.message._id)){
            this.chats[i] = data.message;
            break;
          }
        }
        this.msgData = { room: user.room, nickname: user.nickname, message: '',liked_count:0,liked_by:[] }
        this.scrollToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '',liked_count:0,liked_by:[] };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
  }
  likeMessage(chat)
  {
    var user = JSON.parse(localStorage.getItem("user"));
    chat.liked_by.push({name: user.nickname});
    chat.liked_count = chat.liked_count + 1;
    this.chatService.updateChat(chat._id.toString(), chat).then((result) => {
      this.socket.emit('update-message', chat);
    }, (err) => {
      console.log(err);
    });
  }
  checkAlreadyClicked(chat)
  {
    var user = JSON.parse(localStorage.getItem("user"));
    for (var i = 0; i < chat.liked_by.length; i++) {
      if (chat.liked_by[i].name === user.nickname) {
        return true;
      }
    }
    return false;
  }

}
