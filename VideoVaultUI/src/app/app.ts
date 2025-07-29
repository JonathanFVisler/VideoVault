import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoService, Video } from './video.service';
import { VideoList } from './components/video-list/video-list';
import { NavigationBar } from './components/navigation-bar/navigation-bar';
import { VideoPlayerSection } from './components/video-player-section/video-player-section';
import { AddVideoSection } from './components/add-video-section/add-video-section';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoList, NavigationBar, VideoPlayerSection, AddVideoSection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  @ViewChild('videoPlayerPanel') videoPlayerPanel!: ElementRef<HTMLInputElement>;
  @ViewChild('newDisplayNameInput') newDisplayNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('newCreatorInput') newCreatorInput!: ElementRef<HTMLInputElement>;

  public addVideoFormVisible = false;
  public selectedVideo: Video | undefined = undefined;
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

  openVideo(videoId: number): void {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      this.selectedVideo = video;
    } else {
      console.error('Video not found:', videoId);
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
      if (data.length === 0) {
        console.error('No videos found');
        return;
      }
      this.selectedVideo = data[0];
    });
  }

  searchVideos(searchTerm: string): void {
    this.videoService.getVideoSearch(searchTerm, this.maxVideosSearch).subscribe(data => {
      this.videos = data;
    });
  }
}