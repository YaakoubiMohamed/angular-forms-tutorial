import { Routes } from '@angular/router';
import { IndexChapterComponent } from './index/index-chapter.component';
import { CoreConceptsChapterComponent } from './core-concepts/core-concepts-chapter.component';
import { FormClassesChapterComponent } from './form-classes/form-classes-chapter.component';
import { DirectivesChapterComponent } from './directives/directives-chapter.component';
import { StatePropertiesChapterComponent } from './state-properties/state-properties-chapter.component';
import { ValidationChapterComponent } from './validation/validation-chapter.component';
import { ReactiveProgrammingChapterComponent } from './reactive-programming/reactive-programming-chapter.component';
import { ModulesChapterComponent } from './modules/modules-chapter.component';
import { PatternsChapterComponent } from './patterns/patterns-chapter.component';

export const CHAPTER_ROUTES: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexChapterComponent },
  { path: 'core-concepts', component: CoreConceptsChapterComponent },
  { path: 'form-classes', component: FormClassesChapterComponent },
  { path: 'directives', component: DirectivesChapterComponent },
  { path: 'state-properties', component: StatePropertiesChapterComponent },
  { path: 'validation', component: ValidationChapterComponent },
  { path: 'reactive-programming', component: ReactiveProgrammingChapterComponent },
  { path: 'modules', component: ModulesChapterComponent },
  { path: 'patterns', component: PatternsChapterComponent }
];
