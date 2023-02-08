import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadArtComponent } from './quad-art.component';

describe('QuadArtComponent', () => {
  let component: QuadArtComponent;
  let fixture: ComponentFixture<QuadArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuadArtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuadArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
