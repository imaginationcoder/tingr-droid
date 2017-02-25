import {Component, ViewContainerRef, OnInit} from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import { TokenService } from "../../services/token.service";
import { ParentInfo } from "../../providers/data/parent_info";
import { ParentService } from "../../services/parent_service";
import { ServerErrorService } from "../../services/server.error.service";
import { ConversationService } from "../../services/conversation.service";
import { SharedData } from "../../providers/data/shared_data";

let nstoasts = require("nativescript-toasts");
let app = require("application");

@Component({
    moduleId: module.id,
    selector: 'settings-page',
    templateUrl: './conversations.html',
    styleUrls: ["./conversations.css"],
    providers: [ ConversationService,ParentService, ServerErrorService ]
})
export class ConversationsComponent implements OnInit {
    public isLoading: Boolean = false;
    public conversations: Array<any>;

    constructor(
                private routerExtensions: RouterExtensions,
                private parentService: ParentService,
                private conversationService: ConversationService,
                private vcRef: ViewContainerRef,
                private sharedData: SharedData,
                private serverErrorService: ServerErrorService,
                private router: Router) {

        this.conversations = []
    }

    ngOnInit() {
        // show alert if no internet connection
        this.getList();
    }

    onItemTap(args) {
        let conversation = this.conversations[args.index];
        // set orgId and conversationId
        this.sharedData.organizationId = conversation.org_id;
        this.sharedData.conversationId = conversation.conversation_klid;

        this.routerExtensions.navigate(["/messages"], {
            transition: {
                name: "slideLeft"
            }
        });
    }

    getList(){
        this.isLoading = true;
        this.conversationService.getList()
            .subscribe(
                (result) => {
                    var body = result.body;
                    JSON.stringify("Conversations "+ JSON.stringify(body));
                    this.conversations = body.conversations;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    // pull to refresh the data
    refreshList(args) {
        let pullRefresh = args.object;
        this.conversationService.getList()
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.conversations = body.conversations;
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    this.serverErrorService.showErrorModal();
                }
            );

    }


    goBack() {
       this.routerExtensions.backToPreviousPage();
    }
}