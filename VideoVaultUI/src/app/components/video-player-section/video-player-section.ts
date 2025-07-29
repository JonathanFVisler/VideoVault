import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Video } from '../../video.service';

@Component({
  selector: 'app-video-player-section',
  imports: [],
  templateUrl: './video-player-section.html',
  styleUrl: './video-player-section.css'
})
export class VideoPlayerSection {
  @ViewChild('videoPlayerPanel') videoPlayerPanelRef!: ElementRef<HTMLDivElement>;

  @Input() video: Video | undefined;
  @Output() autoplayNewVideo = new EventEmitter<void>();

  public showVideoPanel = false;
  public videoPlayerPanelMaxHeight: number = 0;
  public autoplay = false;

  isVideoSelected(): boolean {
    return this.video !== null && this.video !== undefined;
  }

  toggleAutoplay(): void {
    this.autoplay = !this.autoplay;
  }

  onVideoStarted(): void {
    this.showVideoPanel = true;
    this.updateVideoPlayerPanelHeight();
  }

  onVideoEnded(): void {
    if (this.autoplay) {
      this.autoplayNewVideo.emit();
    } else {
      this.closeVideo();
    }
  }

  closeVideo(): void {
    this.showVideoPanel = false;
    this.video = undefined;
  }

  playVideo(): void {
    if (!this.isVideoSelected()) {
      console.error('No video selected to play');
      return;
    }
    this.showVideoPanel = true;
    this.updateVideoPlayerPanelHeight();
  }

  updateVideoPlayerPanelHeight(): void {
    if (this.videoPlayerPanelRef?.nativeElement) {
      const el = this.videoPlayerPanelRef.nativeElement;
      this.videoPlayerPanelMaxHeight = el.scrollHeight;
    }
  }
}
