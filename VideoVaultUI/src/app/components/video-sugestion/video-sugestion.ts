import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../video.service';


@Component({
  selector: 'app-video-sugestion',
  standalone: true,
  imports: [],
  templateUrl: './video-sugestion.html',
  styleUrl: './video-sugestion.css'
})
export class VideoSugestion {
  @Input() video!: Video;
  @Output() videoSelect = new EventEmitter<number>();

  openVideo(videoId: number): void {
    this.videoSelect.emit(videoId);
  }
}
