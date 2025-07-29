import { Component, inject, Input, ViewChild, ElementRef } from '@angular/core';
import { VideoService, Video } from '../../video.service';

@Component({
  selector: 'app-add-video-section',
  imports: [],
  templateUrl: './add-video-section.html',
  styleUrl: './add-video-section.css'
})
export class AddVideoSection {
  @Input() addVideoFormVisible: boolean = false;

  @ViewChild('displayNameInput') displayNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('creatorInput') creatorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('addVideoPanel') addVideoPanelRef!: ElementRef<HTMLDivElement>;

  public addVideoPanelMaxHeight: number = 0;
  
  private videoService = inject(VideoService);

  newVideo: Video = {
    fileName: '',
    creator: '',
    duration: '',
    id: 0,
    thumbnailPath: '',
    filePath: ''
  };
  selectedFile: File | null = null;

  onNewVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) { return; }
    const file = input.files[0];

    if (!file.type.startsWith('video/')) { return; }

    this.selectedFile = file;
    this.newVideo.fileName = file.name;
    this.displayNameInput.nativeElement.value = file.name;
    this.creatorInput.nativeElement.value = "Undefined";
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.src = URL.createObjectURL(file);
    videoElement.onloadedmetadata = () => {
      this.newVideo.duration = videoElement.duration.toFixed(2);
      URL.revokeObjectURL(videoElement.src); // Clean up the object URL
    };
  }

  uploadResponse: string = '';

  submitVideo(event: Event): void {
    console.log('Submitting video:', this.selectedFile, this.newVideo);
    event.preventDefault();

    if (!this.selectedFile) {
      console.error('No video file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('displayName', this.displayNameInput.nativeElement.value || '');
    formData.append('creator', this.creatorInput.nativeElement.value || '');
    formData.append('duration', this.newVideo.duration);

    this.videoService.uploadVideo(formData).subscribe(response => {
      console.log('Upload complete', response);
      this.uploadResponse = response.valueOf().toString();
    });
  }

  updateVideoPlayerPanelHeight(): void {
    if (this.addVideoPanelRef?.nativeElement) {
      const el = this.addVideoPanelRef.nativeElement;
      this.addVideoPanelMaxHeight = el.scrollHeight;
    }
  }
}
