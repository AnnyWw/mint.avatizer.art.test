import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { texts } from 'src/environments/texts';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  readonly texts = texts;
  readonly environment = environment;
  counter: number = 10; 
  constructor(private router: Router) { }
  interval;

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', function (event) {
      $('body').addClass('loaded');
    });

    this.interval = setInterval(() => {
      if (this.counter === 0) {
        this.router.navigate(['/']);
      } else {
        this.counter--; 
      }
    }, 1000);
  }
  ngOnDestroy(){
    clearInterval(this.interval);
  }
}
