import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { texts } from 'src/environments/texts';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  readonly texts = texts;
  readonly environment = environment;
  counter: number = 10; 
  constructor(private router: Router) { }

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function (event) {
      $('body').addClass('loaded');
    });

    setInterval(() => {
      this.counter === 0 ? this.router.navigate(['/']) : this.counter--;
    }, 1000);
  }
}
