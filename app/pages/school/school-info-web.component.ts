import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import { ParentService } from "../../services/parent_service";
import { ServerErrorService } from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";

@Component({
    moduleId: module.id,
    selector: 'school-webview',
    templateUrl: './webview.html',
    providers: [ ParentService, ServerErrorService ]
})
export class SchoolInfoWebComponent implements OnInit{
    public isLoading: Boolean = false;
    public schoolUrl: string = '';
    public schoolLinkName: string = '';

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private parentService: ParentService,
                private sharedData: SharedData,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private router: Router) {
        this.schoolUrl = this.sharedData.schoolUrl;
        this.schoolLinkName = this.sharedData.schoolLinkName;

    }

    ngOnInit(){
        // show alert if no internet connection
    }

    goBack(){
        this.routerExtensions.backToPreviousPage();
    }



}