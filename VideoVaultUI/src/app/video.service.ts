import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Video {
  id: number;
  thumbnailPath: string;
  fileName: string;
  filePath: string;
  creator: string;
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>('/api/videos');
  }

  getRandomVideos(count: number): Observable<Video[]> {
    return this.http.get<Video[]>(`/api/videos/random/${count}`);
  }

  getVideoSearch(query: string, maxResults: number): Observable<Video[]> {
    return this.http.get<Video[]>(`/api/videos/search/${query}/${maxResults}`);
  }

  uploadVideo(data: FormData) {
    console.warn('Uploading video:', data);
    return this.http.post('/api/videos', data);
  }
}