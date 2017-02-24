import {Component} from "@angular/core";
import { ParentInfo } from "../../providers/data/parent_info";
import { ParentService} from "../../services/parent_service";
let app = require("application");
@Component({
    moduleId: module.id,
    selector: 'drawer-content',
    templateUrl: './drawer.component.html',
    providers: [ParentService]
})
export class DrawerComponent {

    public parentInfo;
    public parentFullname: String;
    public parentPhotograph: String;
    public parentEmail: String;
    constructor(private parentService: ParentService) {


        this.parentInfo = ParentInfo.parsedDetails.profile;
        this.parentFullname = this.parentInfo.fname+ ' '+this.parentInfo.lname;
        this.parentPhotograph = this.parentInfo.photograph;
        this.parentEmail = this.parentInfo.email;
        // update teacher profile in background
        //this.getProfileDetails();
    }

    /*getProfileDetails(){
        let parent_klid = this.parentInfo.kl_id;
        this.parentService.profileDetails(parent_klid)
            .subscribe(
                (result) => {
                    let body = result.body;
                    this.parentInfo.photograph = body.photograph;
                    this.parentInfo.fname = body.fname;
                    this.parentInfo.lname = body.lname;
                    // update Teacher Info
                    ParentInfo.details = JSON.stringify(this.parentInfo);
                },
                (error) => {

                }
            );
    }*/

}



