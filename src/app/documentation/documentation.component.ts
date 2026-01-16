import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

interface Chapter {
  id: string;
  title: string;
  file: string;
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  bookTitle = 'Angular Forms';

  chapters: Chapter[] = [
    { id: 'index', title: 'Table des Matières', file: 'index' },
    { id: 'core-concepts', title: 'Concepts Fondamentaux', file: '01-core-concepts' },
    { id: 'form-classes', title: 'Classes de Formulaires', file: '02-form-classes' },
    { id: 'directives', title: 'Directives', file: '03-directives' },
    { id: 'state-properties', title: 'État et Propriétés', file: '04-state-properties' },
    { id: 'validation', title: 'Validation', file: '05-validation' },
    { id: 'reactive-programming', title: 'Programmation Réactive', file: '06-reactive-programming' },
    { id: 'modules', title: 'Modules', file: '07-modules' },
    { id: 'patterns', title: 'Patterns et Bonnes Pratiques', file: '08-patterns' }
  ];

  currentChapter: Chapter = this.chapters[0];
  currentChapterIndex = 0;
  sidebarOpen = true;

  ngOnInit() {
    // Subscribe to child route changes
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateCurrentChapter();
    });
    
    // Initialize current chapter
    this.updateCurrentChapter();
  }

  private updateCurrentChapter() {
    const urlPath = this.router.url.split('?')[0];
    const chapterId = urlPath.split('/').pop() || 'index';
    
    const index = this.chapters.findIndex(c => c.id === chapterId);
    if (index !== -1) {
      this.currentChapter = this.chapters[index];
      this.currentChapterIndex = index;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToChapter(chapter: Chapter) {
    this.router.navigate(['/documentation', chapter.id]);
  }

  previousChapter() {
    if (this.currentChapterIndex > 0) {
      this.navigateToChapter(this.chapters[this.currentChapterIndex - 1]);
    }
  }

  nextChapter() {
    if (this.currentChapterIndex < this.chapters.length - 1) {
      this.navigateToChapter(this.chapters[this.currentChapterIndex + 1]);
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get hasPrevious(): boolean {
    return this.currentChapterIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentChapterIndex < this.chapters.length - 1;
  }

  get progressPercent(): number {
    return ((this.currentChapterIndex + 1) / this.chapters.length) * 100;
  }
}
