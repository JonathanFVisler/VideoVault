import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  imports: [],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.css'
})
export class NavigationBar {
  @Output() toggleAddVideoForm = new EventEmitter<void>();
  @Output() searchVideos = new EventEmitter<string>();
}
