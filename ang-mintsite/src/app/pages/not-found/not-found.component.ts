import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function (event) {
      $('body').addClass('loaded');
    });

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 10000);  //10s
  }

}
