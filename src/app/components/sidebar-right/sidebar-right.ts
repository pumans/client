import { Component, inject, input, signal } from '@angular/core';
import { EditorColumnWidget } from './editor-column-widget/editor-column-widget';
import { VideoWidget } from './video-widget/video-widget';
import { NewsService } from '../../services/news.service';
import { JudicialTruthWidget } from './judicial-truth-widget/judicial-truth-widget';
import { CourtStoriesWidget } from './court-stories-widget/court-stories-widget';
// import { PopularTodayWidget } from './popular-today-widget/popular-today-widget';
// import { EventsCalendarWidget } from './events-calendar-widget/events-calendar-widget';

@Component({
  selector: 'app-sidebar-right',
  imports: [EditorColumnWidget, VideoWidget, JudicialTruthWidget, CourtStoriesWidget ], // PopularTodayWidget, EventsCalendarWidget
  templateUrl: './sidebar-right.html',
  standalone: true,
})
export class SidebarRight {
  showEditorColumn = input<boolean>(true);
  showJudicialTruth = input<boolean>(true);
  showCourtStories = input<boolean>(true);
}
