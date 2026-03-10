import { Component } from '@angular/core';
import { EditorColumnWidget } from './editor-column-widget/editor-column-widget';
import { VideoWidget } from './video-widget/video-widget';
// import { PopularTodayWidget } from './popular-today-widget/popular-today-widget';
// import { EventsCalendarWidget } from './events-calendar-widget/events-calendar-widget';

@Component({
  selector: 'app-sidebar-right',
  imports: [EditorColumnWidget, VideoWidget], // PopularTodayWidget, EventsCalendarWidget
  templateUrl: './sidebar-right.html',
  standalone: true,
})
export class SidebarRight {}
