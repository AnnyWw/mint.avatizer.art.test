import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintUglyfacesComponent } from './mint-uglyfaces.component';

describe('MintUglyfacesComponent', () => {
  let component: MintUglyfacesComponent;
  let fixture: ComponentFixture<MintUglyfacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintUglyfacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintUglyfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
