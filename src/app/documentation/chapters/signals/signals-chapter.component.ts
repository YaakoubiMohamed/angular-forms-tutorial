import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signals-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './signals-chapter.component.html',
  styleUrls: ['./signals-chapter.component.css', '../shared-chapter-styles.css']
})
export class SignalsChapterComponent {
  onAnchorClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      event.preventDefault();
      const id = target.getAttribute('href')!.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
