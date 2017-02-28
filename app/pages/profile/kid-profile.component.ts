import {Component, ViewContainerRef, OnInit} from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import {Page} from "ui/page";
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
    selector: 'kid-profile-page',
    templateUrl: './kid-profile.html',
    styleUrls: ["./kid-profile.css"],
    providers: [ ConversationService,ParentService, ServerErrorService ]
})
export class KidProfileComponent implements OnInit {
    public isLoading: Boolean = false;
    public kid: any;
    public emptyNoteMessage: string;
    public posts: any;

    constructor(
        private routerExtensions: RouterExtensions,
        private parentService: ParentService,
        private conversationService: ConversationService,
        private vcRef: ViewContainerRef,
        private sharedData: SharedData,
        private serverErrorService: ServerErrorService,
        private page: Page,
        private router: Router) {
        this.kid = this.sharedData.kid;

        this.emptyNoteMessage = 'while we wait for the school to share your kid moments ' +
            'we encourage you to digitally organize your entire family documents now - like ' +
            'driving licences, immunity records, insurance cards, son, etc. ';

        this.posts = [];
    }

    ngOnInit() {
        // show alert if no internet connection
        //this.page.actionBarHidden = true;

    } 


    goBack() {
        this.routerExtensions.backToPreviousPage();
    }
}