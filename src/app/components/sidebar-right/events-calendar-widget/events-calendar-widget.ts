import { Component } from '@angular/core';

@Component({
  selector: 'app-events-calendar-widget',
  standalone: true,
  templateUrl: './events-calendar-widget.html',
})
export class EventsCalendarWidget {
  public days = Array.from({ length: 31 }, (_, i) => i + 1);
  public activeDay = 26;
}

