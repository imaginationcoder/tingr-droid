import {
    Component,
    ViewContainerRef,
    ChangeDetectionStrategy,
    OnChanges,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    OnInit,
    SimpleChange
} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router, ActivatedRoute} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {SharedData} from "../../providers/data/shared_data";
import {ServerErrorService} from "../../services/server.error.service";
import {ConversationService} from "../../services/conversation.service";
import {ParentInfo} from "../../providers/data/parent_info";

import {ScrollView} from "ui/scroll-view";

var view = require("ui/core/view");
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");
import dialogs = require("ui/dialogs");
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./messages.css'],
    templateUrl: './messages.html',
    providers: [ConversationService, ServerErrorService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit, OnChanges {
    public kid: any;
    public isLoading: Boolean = false;
    public isAndroid: Boolean = false;
    public isIos: Boolean = false;
    public messages: any;
    public msgs: any;
    public newMessageText: string = '';
    public conversationKlId: string = '';
    public orgId: string = '';
    public lastMessageTime: string = '';
    public conversationKidId: string = '';
    @ViewChild("messagesScroll") messagesScrollRef: ElementRef;


    constructor(private conversationService: ConversationService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                private sharedData: SharedData,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.messages = {};
        this.msgs = {};
        this.conversationKlId = this.sharedData.conversationId;
        this.conversationKidId = this.sharedData.conversationKidId;
        this.orgId = this.sharedData.organizationId;


    }

    ngOnInit() {
        this.getMessages();
    }

    getMessages() {
        this.isLoading = true;
        this.getNewMessages(true, false);
    }

    refreshList(args) {
        let pullRefresh = args.object;
        this.getNewMessages(false, pullRefresh);
    }


    getNewMessages(scrollToBottom = false, pullRefresh) {
        setTimeout(() => {
            this.conversationService.getMessages(this.orgId, this.conversationKlId, this.conversationKidId, this.lastMessageTime)
                .subscribe(
                    (result) => {
                        let body = result.body;
                        let messages = body.messages;
                        if (!this.isMessagesEmpty(body.messages)) {
                            this.lastMessageTime = body.last_message_time;
                            if (!this.isMessagesEmpty(messages)) {
                                for (var key in messages) {
                                    if (messages.hasOwnProperty(key)) {
                                        // alert("Key is " + key + ", value is" + newMessages[key]);
                                        // if date already exists
                                        if (this.msgs[key]) {
                                            messages[key].forEach((msg) => {
                                                this.msgs[key].unshift(msg)
                                            })
                                        } else {
                                            // date doesn't exists so add it newly to oldMessages
                                            this.msgs[key] = messages[key];
                                        }
                                    }
                                }
                            }
                        }
                        this.makeMessagesRead(body.conversation_id, messages);
                        this.isLoading = false;
                        if (pullRefresh) {
                            pullRefresh.refreshing = false;
                        }
                        if (scrollToBottom) {
                            this.scrollToBottom();
                        }
                        this.changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this.isLoading = false;
                        this.serverErrorService.showErrorModal();
                    }
                );
        }, 1000)
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        /*  if (changes['newMessageText']) { // fire your event }
         console.log('------- CHnaged')
         } else {
         console.log('--------- not changes')
         }*/
    }


    makeMessagesRead(conversationKlId, messages) {
        //To get the unread messages and make them as read
        let unreadMessageIds = [];
        let unreadMessages = [];
        let groupedMessages = messages;
        for (let groupedMessage in groupedMessages) {
            if (groupedMessages.hasOwnProperty(groupedMessage)) {
                //console.log("Key is " + groupedMessage + ", value is" + JSON.stringify(groupedMessages[groupedMessage]));
                unreadMessages = groupedMessages[groupedMessage].filter(msg => msg.read_message === false);
                //console.log("Unread Messages " + JSON.stringify(unreadMessages));
                unreadMessages.forEach((message) => {
                    unreadMessageIds.push(message.kl_id)
                })
            }
        }
        // invoke API
        if (unreadMessageIds.length) {
            this.conversationService.makeMessagesRead(conversationKlId, unreadMessageIds)
                .subscribe(
                    (result) => {
                        //console.log("RESULT UNREAD "+ JSON.stringify(result));
                    },
                    (error) => {
                        // console.error(error.stack)
                    }
                );
        }

    }

    sendMessage() {
        // focus out from field
        let msgTexfield = view.getViewById(this.page, "newMessageText");
        let msgText = msgTexfield.text.trim();
        // this.isLoading = true;
        if (msgText == '') {
            return;
        }
       // msgTexfield.dismissSoftInput();
        let parent = ParentInfo.profile;

        let newMsg = {
            kl_id: "",
            text: msgText,
            sender_name: parent.fname + ' ' + parent.lname,
            sender_klid: parent.kl_id,
            photograph: parent.photograph,
            child_name: "", child_relationship: "",
            conversation_klid: this.conversationKlId,
            created_at: new Date(), read_message: true
        };

        let isFirstMessage = this.isMessagesEmpty(this.msgs);
        if (isFirstMessage) {
            this.isLoading = true;
        } else {
            let currentDate = moment(new Date()).format('MM/DD/YYYY');
            // if date already exists
            if (this.msgs[currentDate]) {
                this.msgs[currentDate].push(newMsg);
            } else {
                this.msgs[currentDate] = [newMsg];// date doesn't exists so add it newly
            }
        }

        this.scrollToBottom();
        // send message to server in background
        this.conversationService.sendMessage(msgText, this.orgId, this.conversationKlId, this.conversationKidId)
            .subscribe(
                (result) => {
                    let body = result.body;
                    if (isFirstMessage) {
                        this.getNewMessages(false, false)
                    }
                },
                (error) => {
                    this.serverErrorService.showErrorModal();
                }
            );
        msgTexfield.text = '';

    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    isMessagesEmpty(obj) {
        //return (Object.keys(obj).length === 0);
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    scrollToBottom() {
        // https://gitnet.fr/deblan/nativescript-docs/src/v1.0.0/ApiReference/ui/scroll-view/ScrollView.md
        // scroll to bottom of the message using ScrollView ---
        setTimeout(() => {
            let messagesScrollerView = <ScrollView>this.messagesScrollRef.nativeElement;
            let offset = messagesScrollerView.scrollableHeight; // get the current scroll height
            messagesScrollerView.scrollToVerticalOffset(offset, true); // scroll to the bottom with animation
        }, 700);
    }

}
