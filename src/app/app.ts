import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { MainContent } from './components/main-content/main-content';
import { SidebarLeft } from './components/sidebar-left/sidebar-left';
import { SidebarRight } from './components/sidebar-right/sidebar-right';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeroComponent, MainContent, SidebarLeft, SidebarRight, Footer],
  templateUrl: `./app.html`,
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 15px;
      }
    `,
  ],
})
export class App {
  title = 'pravo-news';
}
