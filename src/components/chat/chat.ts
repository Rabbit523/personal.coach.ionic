import { Component, ViewChild } from '@angular/core';
import { NavParams, Content } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider } from '../../shared/index';
import { TrainerModel, UserModel } from '../../models/index';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class Chat {

  mi: UserModel;
  user: any;
  _user: Observable<any[]>;
  _chat: AngularFireList<any>;
  _messages: AngularFireList<any>;
  chats: any;
  recipient: TrainerModel;
  isLoading: boolean;
  message = new FormControl();
  key;
  @ViewChild(Content) content: Content;

  constructor(
    private navParams: NavParams,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private error$: ErrorHandlerProvider,
  ) { }

  ionViewDidLoad() {
    this.mi = this.auth$.currentUser;
    this.recipient = this.navParams.data;
    this._chat = this.data$.list('/chat');

    this.findChat();

  }

  ionViewDidEnter() {
    this.content.scrollToBottom(0)
  }


  findChat() {
    /**
     * get snapshots data from chats (snapshots include the key of the data and the data itself)
     * if no chat data available create a new one and use the key to create a messages channel
     * if chat is available, loop through avaiable chat
     *    while looping chat, check if chat matches the given sender and recipient id
     *    (note. sender and reciepient are dependent on who is logged in therefore check if both sender and reciepient id match for a given user using
     *       if ((snapshot.val().sender === this.mi.uid && snapshot.val().recipient === this.recipient.uid) ||
                  (snapshot.val().recipient === this.mi.uid && snapshot.val().sender === this.recipient.uid))
          )
     *    if chat exists, get the chat key and use it to get the messages channel  (this._messages = this.data$.list('/messages/' + this.key);)
     */
    this._chat.valueChanges()
      .subscribe((snapshots: any) => {
        if (snapshots.length === 0) {
          this.key = this._chat.push({
            sender: this.mi.uid,
            recipient: this.recipient.uid
          }).key;
          this._messages = this.data$.list('/messages/' + this.key);
        } else {
          if (!this.key) {
            snapshots.forEach(snapshot => {
              if ((snapshot.sender === this.mi.uid && snapshot.recipient === this.recipient.uid) ||
                (snapshot.recipient === this.mi.uid && snapshot.sender === this.recipient.uid)) {
                this.key = snapshot.key;
              }
            });
          }
          if (this.key) {
            this.data$.list('/messages/' + this.key).valueChanges().subscribe((msg: any) =>{
              this._messages = msg;
            });
          } else {
            this.key = this._chat.push({
              sender: this.mi.uid,
              recipient: this.recipient.uid
            }).key;
          }
        }
      })
  }

  send(message) {
    this.data$.list('/messages/' + this.key).push({
      sender: this.mi.uid,
      text: message,
      read_at: new Date(),
      sent_at: new Date()
    }).then(
      () => {
        this.autoReply();
        this.message.reset();
        this.content.scrollToBottom(0);
      },
      (error) => this.error$.handleError(error));
  }


  private autoReply() {
    setTimeout(() => {
      this.data$.list('/messages/' + this.key).push({
        sender: this.recipient.uid,
        text: msgs[Math.floor(Math.random() * msgs.length)].message,
        read_at: new Date(),
        sent_at: new Date()
      }).then(
        () => { },
        (error) => this.error$.handleError(error));
    }, Math.floor(Math.random() * 6000) + 1000);
  }

}

var msgs = [{
  "message": "Integer ac leo."
}, {
  "message": "In eleifend quam a odio."
}, {
  "message": "Donec ut mauris eget massa tempor convallis."
}, {
  "message": "Maecenas tincidunt lacus at velit."
}, {
  "message": "Phasellus in felis."
}, {
  "message": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros."
}, {
  "message": "Nulla tellus."
}, {
  "message": "In eleifend quam a odio."
}, {
  "message": "Nulla justo."
}, {
  "message": "Pellentesque at nulla."
}, {
  "message": "Nam tristique tortor eu pede."
}, {
  "message": "Donec dapibus."
}, {
  "message": "Donec ut mauris eget massa tempor convallis."
}, {
  "message": "Fusce posuere felis sed lacus."
}, {
  "message": "In blandit ultrices enim."
}, {
  "message": "Morbi porttitor lorem id ligula."
}, {
  "message": "Mauris sit amet eros."
}, {
  "message": "Nullam porttitor lacus at turpis."
}, {
  "message": "Nunc nisl."
}, {
  "message": "Nulla ac enim."
}, {
  "message": "Cras non velit nec nisi vulputate nonummy."
}, {
  "message": "Curabitur at ipsum ac tellus semper interdum."
}, {
  "message": "Nunc purus."
}, {
  "message": "In hac habitasse platea dictumst."
}, {
  "message": "Curabitur at ipsum ac tellus semper interdum."
}, {
  "message": "Duis ac nibh."
}, {
  "message": "Duis at velit eu est congue elementum."
}, {
  "message": "Pellentesque at nulla."
}, {
  "message": "Praesent blandit."
}, {
  "message": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
}, {
  "message": "Quisque porta volutpat erat."
}, {
  "message": "Pellentesque viverra pede ac diam."
}, {
  "message": "Etiam vel augue."
}, {
  "message": "Etiam pretium iaculis justo."
}, {
  "message": "Nullam varius."
}, {
  "message": "Morbi porttitor lorem id ligula."
}, {
  "message": "Suspendisse accumsan tortor quis turpis."
}, {
  "message": "Mauris sit amet eros."
}, {
  "message": "Vivamus in felis eu sapien cursus vestibulum."
}, {
  "message": "Integer non velit."
}, {
  "message": "Maecenas tincidunt lacus at velit."
}, {
  "message": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante."
}, {
  "message": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo."
}, {
  "message": "Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl."
}, {
  "message": "Quisque id justo sit amet sapien dignissim vestibulum."
}, {
  "message": "Mauris lacinia sapien quis libero."
}, {
  "message": "Vivamus vel nulla eget eros elementum pellentesque."
}, {
  "message": "Phasellus in felis."
}, {
  "message": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
}, {
  "message": "Integer ac neque."
}, {
  "message": "Integer a nibh."
}, {
  "message": "Aliquam non mauris."
}, {
  "message": "Vivamus vestibulum sagittis sapien."
}, {
  "message": "Morbi vel lectus in quam fringilla rhoncus."
}, {
  "message": "Integer ac neque."
}, {
  "message": "Morbi non quam nec dui luctus rutrum."
}, {
  "message": "Sed accumsan felis."
}, {
  "message": "Vestibulum sed magna at nunc commodo placerat."
}, {
  "message": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo."
}, {
  "message": "Donec ut dolor."
}, {
  "message": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
}, {
  "message": "In blandit ultrices enim."
}, {
  "message": "Donec semper sapien a libero."
}, {
  "message": "Nam dui."
}, {
  "message": "In sagittis dui vel nisl."
}, {
  "message": "Nam tristique tortor eu pede."
}, {
  "message": "Nulla ut erat id mauris vulputate elementum."
}, {
  "message": "Proin risus."
}, {
  "message": "Proin eu mi."
}, {
  "message": "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla."
}, {
  "message": "Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante."
}, {
  "message": "Vivamus in felis eu sapien cursus vestibulum."
}, {
  "message": "Nulla justo."
}, {
  "message": "Aenean auctor gravida sem."
}, {
  "message": "Nunc nisl."
}, {
  "message": "Sed accumsan felis."
}, {
  "message": "Quisque ut erat."
}, {
  "message": "Morbi vel lectus in quam fringilla rhoncus."
}, {
  "message": "In est risus, auctor sed, tristique in, tempus sit amet, sem."
}, {
  "message": "Nulla mollis molestie lorem."
}, {
  "message": "In hac habitasse platea dictumst."
}, {
  "message": "Quisque porta volutpat erat."
}, {
  "message": "Cras pellentesque volutpat dui."
}, {
  "message": "Aenean fermentum."
}, {
  "message": "Sed sagittis."
}, {
  "message": "Ut at dolor quis odio consequat varius."
}, {
  "message": "Nullam varius."
}, {
  "message": "Nullam molestie nibh in lectus."
}, {
  "message": "In congue."
}, {
  "message": "Nunc purus."
}, {
  "message": "Integer ac neque."
}, {
  "message": "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus."
}, {
  "message": "Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl."
}, {
  "message": "Duis bibendum."
}, {
  "message": "Quisque porta volutpat erat."
}, {
  "message": "Maecenas rhoncus aliquam lacus."
}, {
  "message": "Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla."
}, {
  "message": "Maecenas ut massa quis augue luctus tincidunt."
}, {
  "message": "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante."
}, {
  "message": "Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam."
}]
