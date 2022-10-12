import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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

  @HostListener('window:load')
  onLoad() {
    $('body').addClass('loaded');
  }

  constructor(private router: Router) { 
    this.onLoad();
  }
  interval;

  ngOnInit(): void {

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
