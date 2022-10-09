import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { texts } from 'src/environments/texts';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  readonly environment = environment;
  readonly texts = texts;
  FullYear: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

}
