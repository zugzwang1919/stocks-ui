import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomOfPageComponent } from './bottom-of-page.component';

describe('BottomOfPageComponent', () => {
  let component: BottomOfPageComponent;
  let fixture: ComponentFixture<BottomOfPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomOfPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomOfPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
