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
    selector: 'my-family-page',
    templateUrl: './my-family.html',
    styleUrls: ["./my-family.css"],
    providers: [ ConversationService,ParentService, ServerErrorService ]
})
export class MyFamilyComponent implements OnInit {
    public isLoading: Boolean = false;
    public kids: Array<any>;
    public parents: Array<any>;

    constructor(
        private routerExtensions: RouterExtensions,
        private parentService: ParentService,
        private conversationService: ConversationService,
        private vcRef: ViewContainerRef,
        private sharedData: SharedData,
        private serverErrorService: ServerErrorService,
        private router: Router) {

        this.kids = [];
        this.parents = []
    }

    ngOnInit() {
        // show alert if no internet connection
        this.getList();
    }

    openParentProfile(parent) {
       // let conversation = this.conversations[args.index];
        this.sharedData.parent = parent;
    }

    openKidProfile(kid) {
        // let conversation = this.conversations[args.index];
        this.sharedData.kid = kid;
        this.routerExtensions.navigate(["/kid-dashboard"],
            {
                transition: {name: "slideTop"}
            });
    } 
    getList(){
        this.isLoading = true;
        this.parentService.myFamily()
            .subscribe(
                (result) => {
                    var body = result.body;

                    this.kids = body.kids;
                    console.log("Kids "+ JSON.stringify(this.kids));
                    let currentParent;
                    body.parents.forEach(parent => {
                        if(parent.email === ParentInfo.profile.email){
                            currentParent = parent;
                        }else {
                            this.parents.push(parent);
                        }
                    });
                    this.parents.unshift(currentParent); 
                    console.log("Parents--------------")
                    console.log(JSON.stringify(this.parents));
                    console.log("Parents--------------")
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    console.log("error "+ JSON.stringify(error));
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
                    JSON.stringify("My Family "+ JSON.stringify(body));
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
       // this.routerExtensions.backToPreviousPage();

        this.routerExtensions.navigate(["/settings"],
            {
                transition: {name: "slideRight"}
            });
    }
}