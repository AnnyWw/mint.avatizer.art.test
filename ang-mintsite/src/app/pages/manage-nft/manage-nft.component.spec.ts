import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNFTComponent } from './manage-nft.component';

describe('ManageNFTComponent', () => {
  let component: ManageNFTComponent;
  let fixture: ComponentFixture<ManageNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
