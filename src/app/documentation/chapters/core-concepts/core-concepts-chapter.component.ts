import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-core-concepts-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './core-concepts-chapter.component.html',
  styleUrls: ['./core-concepts-chapter.component.css']
})
export class CoreConceptsChapterComponent {
  onAnchorClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        event.preventDefault();
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }
}
