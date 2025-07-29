import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerSection } from './video-player-section';

describe('VideoPlayerSection', () => {
  let component: VideoPlayerSection;
  let fixture: ComponentFixture<VideoPlayerSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayerSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
