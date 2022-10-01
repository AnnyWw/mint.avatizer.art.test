import { Injectable, Inject } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
const Web3 = require('web3');
let web3 = new Web3('ws://localhost:8546');
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //readonly rootURL = environment.endpoint;

readonly rootURL = "https://profitars.ai";
//readonly rootURL = "http://localhost:5000";
constructor(@Inject(DOCUMENT) private document: Document, private http: HttpClient) {}

getWL(wallet:string) {
    console.log('here');
  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': environment.token
    })
  };
  return this.http.post(this.rootURL+"/api/WL/Proof",{ address:wallet }, httpOptions);

}
}