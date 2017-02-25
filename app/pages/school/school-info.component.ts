import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from 'nativescript-angular/router';
import {Router, NavigationExtras} from "@angular/router";
import { ParentService } from "../../services/parent_service";
import { ServerErrorService } from "../../services/server.error.service";
import { SharedData } from "../../providers/data/shared_data";

@Component({
    moduleId: module.id,
    selector: 'school-info-page',
    templateUrl: './school-info.html',
    providers: [ ParentService, ServerErrorService ]
})
export class SchoolInfoComponent implements OnInit{
    public isLoading: Boolean = false;
    public orgId: string = '';
    public orgName: string = '';
    public links: Array<any>;

    constructor(private location: Location,
                private routerExtensions: RouterExtensions,
                private sharedData: SharedData,
                private parentService: ParentService,
                private vcRef: ViewContainerRef,
                private serverErrorService: ServerErrorService,
                private router: Router) {

        this.orgId = this.sharedData.organizationId;
        this.orgName = this.sharedData.organizationName;
        this.links = [];
    }

    ngOnInit(){
        // show alert if no internet connection
        this.getInfo();
    }

    getInfo(){
        this.isLoading = true;
        this.parentService.schoolInfo(this.orgId)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.links = body.info;
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this.serverErrorService.showErrorModal();
                }
            );
    }

    onItemTap(args){
        let link = this.links[args.index];
        this.sharedData.schoolUrl = link.url;
        this.sharedData.schoolLinkName = link.name;
        this.routerExtensions.navigate(["/school-webview"], {
            transition: {
                name: "slideLeft"
            }
        });
    }

    goBack(){
       this.routerExtensions.backToPreviousPage();
    }



}
