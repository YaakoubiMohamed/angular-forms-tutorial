import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `<pre><code [class]="'language-' + language" [textContent]="code"></code></pre>`,
  styles: [`
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    code {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.9rem;
      white-space: pre;
    }
  `]
})
export class CodeBlockComponent {
  @Input() code: string = '';
  @Input() language: string = 'typescript';
}
