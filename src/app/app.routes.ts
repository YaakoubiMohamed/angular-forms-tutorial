import { Routes } from '@angular/router';
import { FormBasics } from './examples/form-basics/form-basics';
import { ReactiveFormIntro } from './examples/reactive-form-intro/reactive-form-intro';
import { TemplateFormIntro } from './examples/template-form-intro/template-form-intro';
import { RegistrationFormComponent } from './examples/registration-form/registration-form';
import { DynamicTodoListComponent } from './examples/dynamic-todo-list/dynamic-todo-list';
import { SurveyFormComponent } from './examples/survey-form/survey-form';
import { CheckoutFormComponent } from './examples/checkout-form/checkout-form';
import { DocumentationComponent } from './documentation/documentation.component';
import { CHAPTER_ROUTES } from './documentation/chapters/chapter.routes';

export const routes: Routes = [
  {
    path: 'documentation',
    component: DocumentationComponent,
    children: CHAPTER_ROUTES,
    title: 'Documentation - Angular Forms'
  },
  {
    path: 'examples/form-basics',
    component: FormBasics,
  },
  {
    path: 'examples/reactive-forms',
    component: ReactiveFormIntro,
  },
  {
    path: 'examples/template-forms',
    component: TemplateFormIntro,
  },
  {
    path: 'examples/registration-form',
    component: RegistrationFormComponent,
  },
  {
    path: 'examples/dynamic-todo-list',
    component: DynamicTodoListComponent,
  },
  {
    path: 'examples/survey-form',
    component: SurveyFormComponent,
  },
  {
    path: 'examples/checkout-form',
    component: CheckoutFormComponent,
  },
  {
    path: '',
    redirectTo: 'examples/form-basics',
    pathMatch: 'full',
  },
];
