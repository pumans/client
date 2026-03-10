import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService, LatestContentItem } from '../../../services/content.service';

@Component({
  selector: 'app-editor-column-widget',
  standalone: true,
  imports: [RouterLink ],
  templateUrl: './editor-column-widget.html',
})
export class EditorColumnWidget implements OnInit {
  private contentService = inject(ContentService);

  // Переходимо на сигнали для кращої продуктивності та стабільності
  public isLoading = signal<boolean>(true);
  public latest = signal<LatestContentItem | null>(null);
  public error = signal<string | null>(null);

  ngOnInit() {
    // Запит виконується відразу (і на сервері, і в браузері)
    this.contentService.getLatestByMenuLink('/editor_column').subscribe({
      next: (data) => {
        this.latest.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Помилка завантаження колонки редактора:', err);
        this.error.set('Не вдалося завантажити колонку редактора');
        this.isLoading.set(false);
      },
    });
  }
}
