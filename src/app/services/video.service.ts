import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ArticleListResponse } from '../models/article';

export interface VideoItem {
  id: number;
  title: string;
  summary: string | null;
  detailText: string | null;
  date: string;
  imageUrl: string | null;
  videoLink: string | null;
}

export interface VideoListResponse {
  categoryName: string;
  articles: VideoItem[];
}

export interface LatestVideos {
  dialogueVideo: VideoItem | null;
  otherVideo: VideoItem | null;
}

/**
 * Сервіс відео.
 * Відповідальність: запити до /api/video/*
 */
@Injectable({ providedIn: 'root' })
export class VideoService {
  private api = inject(ApiService);

  /** Список відео для категорії */
  getBySlug(slug: string): Observable<VideoListResponse> {
    const cleanSlug = slug.replace(/^\/+/, '');
    return this.api.get<VideoListResponse>('/video', { slug: cleanSlug });
  }

  /** Два останніх відео для віджета на головній */
  getLatest(): Observable<LatestVideos> {
    return this.api.get<LatestVideos>('/video/latest');
  }

  /** Одне відео за ID */
  getById(id: number): Observable<VideoItem> {
    return this.api.get<VideoItem>(`/video/${id}`);
  }
}
