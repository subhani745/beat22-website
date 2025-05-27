import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { BeatsService } from 'src/app/services/beats.service';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css']
})
export class ApiListComponent implements OnInit {

  beats: any[] = [];
  currentTime = 0;
  duration = 163000;
  volume = 0.7;
 isLoading: boolean = false;


  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

 togglePlay(index: number): void {
  const audio = this.audioPlayerRef.nativeElement;
  const selectedBeat = this.beats[index];

  if (!selectedBeat.preview) {
    console.error("No preview URL found for this beat:", selectedBeat);
    return;
  }

  if (this.currentPlayingIndex === index && this.isPlaying) {
    audio.pause();
    this.isPlaying = false;
    return;
  }

  if (audio.src !== selectedBeat.preview) {
    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  }

  audio.volume = this.volume;

  audio.play().then(() => {
    this.currentPlayingIndex = index;
    this.isPlaying = true;
  }).catch(error => {
    console.error("Audio play error:", error);
  });
}
  isPlaying: boolean = false;
  currentPlayingIndex: number | null = null;

  constructor(private beatsService: BeatsService) { }

onVolumeChange(event: Event) {
  this.volume = parseFloat((event.target as HTMLInputElement).value);
  this.audioPlayerRef.nativeElement.volume = this.volume;
}

onSeek(event: Event) {
  const seekTime = parseFloat((event.target as HTMLInputElement).value);
  this.audioPlayerRef.nativeElement.currentTime = seekTime;
}
formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}
toggleLike(index: number) {
  if (this.beats && this.beats[index]) {
    this.beats[index].liked = !this.beats[index].liked;
  }
}
isLiked(index: number): boolean {
  return this.beats?.[index]?.liked ?? false;
}

playPrevious() {
  if (this.currentPlayingIndex !== null && this.currentPlayingIndex > 0) {
    this.currentPlayingIndex--;
    this.togglePlay(this.currentPlayingIndex);
  }
}

playNext() {
  if (
    this.currentPlayingIndex !== null &&
    this.beats &&
    this.currentPlayingIndex < this.beats.length - 1
  ) {
    this.currentPlayingIndex++;
    this.togglePlay(this.currentPlayingIndex);
  }
}

  ngOnInit(): void {
    this.isLoading = true;
    this.beatsService.getBeats().subscribe((data) => {
      this.isLoading = false;
      this.beats = data?.playlists[0]?.beats || [];
      console.log("this.beats", this.beats);
    });
  }
  ngAfterViewInit(): void {
  const audio = this.audioPlayerRef.nativeElement;
  audio.addEventListener('loadedmetadata', () => {
    this.duration = audio.duration;
  });
  audio.addEventListener('timeupdate', () => {
    this.currentTime = audio.currentTime;
  });
  audio.addEventListener('ended', () => {
    this.onEnded();
  });
}
  onEnded(): void {
    this.isPlaying = false;
    this.currentPlayingIndex = null;
  }
}
