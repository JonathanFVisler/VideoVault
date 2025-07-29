import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoSection } from './add-video-section';

describe('AddVideoSection', () => {
  let component: AddVideoSection;
  let fixture: ComponentFixture<AddVideoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVideoSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVideoSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
