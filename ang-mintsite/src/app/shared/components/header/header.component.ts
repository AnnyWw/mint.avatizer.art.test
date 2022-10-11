import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly environment = environment;
  readonly texts = texts;
  currentUrl: string;
  FullYear: number = new Date().getFullYear();

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.currentUrl = this.router.routerState.snapshot.url;
    $(document).ready(function () {
      //console.log('Jquery is working !!!');

      // NEW HEADER JS
      $('.menu-tab').click(function () {
        $('.main-menu').toggleClass('show');
        $('.menu-tab').toggleClass('active');
      });

      
      $(document).mouseup(function (e: any) {
        var container = $('.main-menu');
        var container2 = $('.logo-header');
        if (
          container.has(e.target).length === 0 &&
          container2.has(e.target).length === 0
        ) {
          container.removeClass('show');
          $('.menu-tab').removeClass('active');
        }
      });
      
      
    });
    
  }

}
