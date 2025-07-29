import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSugestion } from './video-sugestion';

describe('VideoSugestion', () => {
  let component: VideoSugestion;
  let fixture: ComponentFixture<VideoSugestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSugestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSugestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
