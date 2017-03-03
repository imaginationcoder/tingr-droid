import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {DrawerPage} from "../drawer.page";
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
    selector: 'my-family-page',
    templateUrl: './my-family.html',
    styleUrls: ["./my-family.css"],
    providers: [ ConversationService,ParentService, ServerErrorService ]
})
export class MyFamilyComponent extends DrawerPage implements OnInit {
    public isLoading: Boolean = false;
    public kids: Array<any>;
    public parents: Array<any>;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private routerExtensions: RouterExtensions,
        private parentService: ParentService,
        private conversationService: ConversationService,
        private vcRef: ViewContainerRef,
        private sharedData: SharedData,
        private serverErrorService: ServerErrorService,
        private router: Router) {
        super(changeDetectorRef);

        this.kids = [];
        this.parents = []
    }

    ngOnInit() {
        // show alert if no internet connection
        this.getList();
    }

    openParentProfile(parent) {
       // let conversation = this.conversations[args.index];
        this.sharedData.profile = parent;
        this.sharedData.isKidProfile = false;
        this.routerExtensions.navigate(["/profile-dashboard"],
            {
                transition: {name: "slideLeft"}
            });
    }

    openKidProfile(kid) {
        // let conversation = this.conversations[args.index];
        this.sharedData.profile = kid;
        this.sharedData.isKidProfile = true;
        this.routerExtensions.navigate(["/profile-dashboard"],
            {
                transition: {name: "slideLeft"}
            });
    } 
    getList(){
        this.isLoading = true;
        this.parentService.myFamily()
            .subscribe(
                (result) => {
                    var body = result.body;

                    this.kids = body.kids;  
                    let currentParent;
                    body.parents.forEach(parent => {
                        if(parent.email === ParentInfo.profile.email){
                            currentParent = parent;
                        }else {
                            this.parents.push(parent);
                        }
                    });
                    this.parents.unshift(currentParent);   
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
        this.parentService.myFamily()
            .subscribe(
                (result) => {
                    var body = result.body; 
                    this.kids = body.kids;
                    this.parents = body.parents;
                    this.isLoading = false;
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