/*
*  {
 "auth_token": "F5qJYKQYtzDHDyxY5PKQ",
 "verified": true,
 "isight_enabled": true,
 "onboarding": false,
 "onboarding_tour": "",
 "fb": true,
 "profile": {
 "kl_id": "b3532654-54ae-418c-9b92-4d2cdffbfe84",
 "photograph": "",
 "profiles_manageds": [{
 "kid_kl_id": "00b81e6c-a461-44e3-950b-4e068ed356cf",
 "kid_name": "O2",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "8aaa419c-d340-4fc5-9468-20ea9496d09b",
 "kid_name": "2nd-S",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "e752923d-5b3d-4fbb-af3a-0bb4b952488b",
 "kid_name": "p2new",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "a7944265-e984-4e76-a648-54e0e26ce334",
 "kid_name": "ddd",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "c6229eaf-10f0-406e-a50f-e846650d5447",
 "kid_name": "Qam t1 p1",
 "manageable": true,
 "relationship": "Grandmother"
 }, {
 "kid_kl_id": "e118074d-91da-49b9-b07a-33856982e138",
 "kid_name": "3",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "6f086e89-33f5-4e4b-bde3-b11e41b1cc6f",
 "kid_name": "2",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "cb879c21-e213-40ad-8984-1bb4add1af42",
 "kid_name": "4",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "03782148-35d3-4081-8cdc-2aba2b25618a",
 "kid_name": "program2",
 "manageable": true,
 "relationship": "Father"
 }, {
 "kid_kl_id": "385b0f87-f0fb-4205-8748-628ca4387bef",
 "kid_name": "1",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "8b5cb319-176f-4b1b-a1a6-02d500cc04f9",
 "kid_name": "mmm",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "743ab860-fce8-437f-9333-40444e28d1a7",
 "kid_name": "Mai",
 "manageable": true,
 "relationship": "Mother"
 }, {
 "kid_kl_id": "e2027c43-318e-47b9-94c3-9f41136e1ba5",
 "kid_name": "sss",
 "manageable": true,
 "relationship": "Mother"
 }],
 "fname": "qamaisa",
 "mname": "",
 "lname": "m",
 "personality": false,
 "organizations": [{
 "id": "5847a5d83537320004000000",
 "name": "TESTING",
 "logo": "https://asset.tingr.org/assets/organization/logo/5847a5d83537320004000000/ca1af78b49690c16aae08bcb4ec308ec.jpg"
 }, {
 "id": "5847a5d93537320004130000",
 "name": "DayCare2 School",
 "logo": "https://asset.tingr.org/assets/organization/logo/5847a5d93537320004130000/082c446384fa9776bdfe588096dd3a55.jpg"
 }],
 "email": "qamaisa@gmail.com",
 "phone_numbers": [{
 "number": "qxcxcxcccx",
 "type": "Home"
 }, {
 "number": "cxcxccxc",
 "type": "Mobile"
 }, {
 "number": "xccxxcvxcv",
 "type": "Work"
 }]
 }
 }
*
* */

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


}