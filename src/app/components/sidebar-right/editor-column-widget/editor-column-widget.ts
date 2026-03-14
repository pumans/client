import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService, LatestContentItem } from '../../../services/content.service';

@Component({
  selector: 'app-editor-column-widget',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './editor-column-widget.html',
})
export class EditorColumnWidget implements OnInit {
  private contentService = inject(ContentService);

  isLoading = signal(true);
  latest = signal<LatestContentItem | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.contentService.getLatestBySlug('editor_column').subscribe({
      next: (data) => {
        this.latest.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Помилка завантаження колонки редактора:', err);
        this.error.set('Не вдалося завантажити колонку редактора');
        this.isLoading.set(false);
      },
    });
  }
}
