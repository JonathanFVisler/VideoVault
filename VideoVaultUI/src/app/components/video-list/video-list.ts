import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../video.service';
import { VideoSugestion } from '../video-sugestion/video-sugestion';

@Component({
  selector: 'app-video-list',
  imports: [ VideoSugestion],
  templateUrl: './video-list.html',
  styleUrl: './video-list.css'
})
export class VideoList {
  @Input() videos: Video[] = [];
  @Output() videoSelect = new EventEmitter<number>();
}
