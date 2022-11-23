import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUglyfacesComponent } from './manage-uglyfaces.component';

describe('ManageUglyfacesComponent', () => {
  let component: ManageUglyfacesComponent;
  let fixture: ComponentFixture<ManageUglyfacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUglyfacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUglyfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
