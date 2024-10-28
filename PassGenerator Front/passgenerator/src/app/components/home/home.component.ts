import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../services/title/title.service';
import { Title } from '@angular/platform-browser';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private titleService = inject(TitleService);
  public env = environment;
  private title = inject(Title);

  private defaultTitle: string = 'PassGenerator - Inicio';

  ngOnInit(): void {
    this.title.setTitle(this.defaultTitle);
    this.titleService.blurTitle(this.defaultTitle);
  }
}
