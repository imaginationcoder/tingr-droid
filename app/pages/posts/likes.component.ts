import {Component, ViewContainerRef, ChangeDetectorRef, OnInit} from "@angular/core";
import {Page} from "ui/page";
import frameModule = require("ui/frame");
import {Router} from "@angular/router";
import {RouterExtensions, PageRoute} from "nativescript-angular/router";
import {SharedData} from "../../providers/data/shared_data";
import {ServerErrorService} from "../../services/server.error.service";
import { PostService } from "../../services/post.service";
var view = require("ui/core/view");
var app = require("application");


var enums = require("ui/enums");
var nstoasts = require("nativescript-toasts");

import dialogs = require("ui/dialogs");

@Component({
    moduleId: module.id,
    selector: 'my-app',
    styleUrls: ['./likes.css'],
    templateUrl: './likes.html',
    providers: [ PostService, ServerErrorService]
})
export class LikesComponent implements OnInit {
    public isLoading: Boolean = false;
    public hearters: Array<any>;

    constructor(private postService: PostService,
                private page: Page, private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private routerExtensions: RouterExtensions,
                private sharedData: SharedData,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService) {
        //super(changeDetectorRef);
        this.hearters = [];
    }

    ngOnInit() {
        // show alert if no internet connection
        this.getList()
    };

    getList(){
        this.isLoading = true;
        let postKlId = this.sharedData.postKlId;
        this.postService.getHearters(postKlId)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.hearters = body.hearters;
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
        let postKlId = this.sharedData.postKlId;
        this.postService.getHearters(postKlId)
            .subscribe(
                (result) => {
                    var body = result.body;
                    this.hearters = body.hearters;
                    setTimeout(() => {
                        pullRefresh.refreshing = false;
                    }, 1000);
                },
                (error) => {
                    this.serverErrorService.showErrorModal();
                }
            );

    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }

}