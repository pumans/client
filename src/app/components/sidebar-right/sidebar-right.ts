import { Component } from '@angular/core';
import { EditorColumnWidget } from './editor-column-widget/editor-column-widget';
import { PopularTodayWidget } from './popular-today-widget/popular-today-widget';
import { VideoWidget } from './video-widget/video-widget';
import { EventsCalendarWidget } from './events-calendar-widget/events-calendar-widget';

@Component({
  selector: 'app-sidebar-right',
  imports: [EditorColumnWidget, PopularTodayWidget, VideoWidget, EventsCalendarWidget],
  templateUrl: './sidebar-right.html',
  standalone: true,
})
export class SidebarRight {}
