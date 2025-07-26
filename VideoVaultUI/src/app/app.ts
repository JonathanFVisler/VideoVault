import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, Video } from './video.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoPlayerPanel') videoPlayerPanelRef!: ElementRef<HTMLDivElement>;

  public addVideoFormVisible = false;
  public selectedVideo: Video | null = null;
  public showVideoPanel = false;
  public videoPlayerPanelMaxHeight: number = 0;
  public autoplay = false;
  private maxVideosShown = 20;
  private maxVideosSearch = 20;
  private videoService = inject(VideoService);

  
  videos: Video[] = [];

  constructor() {
    this.getRandomVideos();
  }

  title(): string {
    return 'Video Vault';
  }

  videoCount(): number {
    return this.videos.length;
  }

  videoList(): Video[] {
    return this.videos;
  }

  toggleAddVideoForm(): void {
    this.addVideoFormVisible = !this.addVideoFormVisible;
  }

  newVideo: any = {
    displayName: '',
    creator: '',
    duration: ''
  };
  selectedFile: File | null = null;

  onNewVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) { return; }
    const file = input.files[0];

    if (!file.type.startsWith('video/')) { return; }

    this.selectedFile = file;
    this.newVideo.fileName = file.name;
    document.getElementsByName('newDisplayNameInput')[0].setAttribute('value', file.name);
    document.getElementsByName('newCreatorInput')[0].setAttribute('value', "Undefined");
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
    formData.append('displayName', document.querySelector<HTMLInputElement>('input[name="newDisplayNameInput"]')?.value || '');
    formData.append('creator', document.querySelector<HTMLInputElement>('input[name="newCreatorInput"]')?.value || '');
    formData.append('duration', this.newVideo.duration);

    this.videoService.uploadVideo(formData).subscribe(response => {
      console.log('Upload complete', response);
      this.uploadResponse = response.valueOf().toString();
    });
  }

  openVideo(videoId: number): void {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      if(this.selectedVideo != null) {
        // close current video to avoid overlapping animation triggers
        // otherwise the video panel will get vertically clipped
        this.closeVideo();
      }
      this.selectedVideo = video;
      setTimeout(() => {
        this.showVideoPanel = true;
      }, 100);
    } else {
      console.error('Video not found:', videoId);
    }
  }

  closeVideo(): void {
    this.showVideoPanel = false;
    this.selectedVideo = null; 
  }

  updateVideoPlayerPanelHeight(): void {
    if (this.videoPlayerPanelRef?.nativeElement) {
      const el = this.videoPlayerPanelRef.nativeElement;
      this.videoPlayerPanelMaxHeight = el.scrollHeight;
    }
  }

  getRandomVideos(): void {
    this.getNRandomVideos(this.maxVideosShown);
  }

  getNRandomVideos(count: number): void {
    this.videoService.getRandomVideos(count).subscribe(data => {
      this.videos = data;
    });
  }

  playRandomVideo(): void {
    this.videoService.getRandomVideos(1).subscribe(data => {
      this.selectedVideo = data[0];
      this.showVideoPanel = true;
      setTimeout(() => {
        this.updateVideoPlayerPanelHeight();
      }, 1000);
    });
  }

  onVideoEnded(): void {
    if (this.autoplay) {
      this.playRandomVideo();
    } else {
      this.closeVideo();
    }
  }

  toggleAutoplay(): void {
    this.autoplay = !this.autoplay;
  }

  searchVideos(): void {
    const query = this.searchInput.nativeElement.value.trim();
    console.log('Searching for videos with query:', query);
    if (!query) {
      this.getRandomVideos();
      return;
    }
    this.videoService.getVideoSearch(query, this.maxVideosSearch).subscribe(data => {
      this.videos = data;
    });
  }
}