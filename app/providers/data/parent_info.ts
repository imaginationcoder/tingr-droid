import { Injectable } from '@angular/core';
import { getString, setString } from "application-settings";

@Injectable()
export class ParentInfo {

    public storage: any;

    public constructor() { }

    static get details(): string {
        return getString("parentDetails");
    }

    static set details(str: string) {
        setString("parentDetails", str);
    }

    static get parsedDetails(): any {
        return JSON.parse(getString("parentDetails"));
    }

    static get profile(): any {
       return this.parsedDetails.profile;
    }


    static get organizations(): any {
       return this.profile.organizations;
    }

    static get managedKids(): any {
       return this.profile.profiles_manageds;
    }


}