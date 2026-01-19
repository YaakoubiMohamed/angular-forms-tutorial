import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-modules-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule, CodeBlockComponent],
  templateUrl: './modules-chapter.component.html',
  styleUrls: ['./modules-chapter.component.css']
})
export class ModulesChapterComponent {
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

  overviewDiagram = `+-----------------------------------------------------------------+
│                    @angular/forms PACKAGE                        │
+-----------------------------------------------------------------+
                              │
            +-----------------+-----------------+
            │                                   │
            ▼                                   ▼
   +-----------------+                +---------------------+
   │   FormsModule   │                │ ReactiveFormsModule │
   +-----------------+                +---------------------+
            │                                    │
            │  Template-Driven                   │  Reactive Forms
            │  Approach                          │  Approach
            │                                    │
   +-----------------+                +---------------------+
   │  Directives:    │                │   Directives:       │
   │  • ngModel      │                │   • formControl     │
   │  • ngForm       │                │   • formControlName │
   │  • ngModelGroup │                │   • formGroup       │
   │                 │                │   • formGroupName   │
   │                 │                │   • formArrayName   │
   +-----------------+                +---------------------+`;

  formsModuleImport = `import { FormsModule } from '@angular/forms';`;

  formsModuleSetup = `// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ContactFormComponent } from './contact-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule  // Import FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`;

  formsModuleUsage = `// contact-form.component.ts
@Component({
  selector: 'app-contact-form',
  template: \`
    <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">
      <input name="name" [(ngModel)]="model.name" required>
      <input name="email" [(ngModel)]="model.email" required email>
      <textarea name="message" [(ngModel)]="model.message"></textarea>
      <button type="submit" [disabled]="contactForm.invalid">Send</button>
    </form>
  \`
})
export class ContactFormComponent {
  model = {
    name: '',
    email: '',
    message: ''
  };
  
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Data:', this.model);
    }
  }
}`;

  reactiveFormsImport = `import { ReactiveFormsModule } from '@angular/forms';`;

  reactiveFormsSetup = `// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RegistrationFormComponent } from './registration-form.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule  // Import ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`;

  reactiveFormsUsage = `// registration-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="username">
      <input formControlName="email" type="email">
      <input formControlName="password" type="password">
      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  \`
})
export class RegistrationFormComponent {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
    }
  }
}`;

  bothModulesConfig = `@NgModule({
  imports: [
    FormsModule,         // For template-driven forms
    ReactiveFormsModule  // For reactive forms
  ]
})
export class AppModule { }`;

  featureModuleImport = `// user.module.ts
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule  // Required in feature modules too
  ],
  declarations: [
    UserProfileComponent,
    UserSettingsComponent
  ]
})
export class UserModule { }`;

  sharedModulePattern = `// shared/forms-shared.module.ts
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom form components
import { ValidationMessageComponent } from './validation-message.component';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ValidationMessageComponent,
    FormFieldComponent
  ],
  exports: [
    // Re-export Angular modules
    FormsModule,
    ReactiveFormsModule,
    // Export custom components
    ValidationMessageComponent,
    FormFieldComponent
  ]
})
export class FormsSharedModule { }`;

  sharedModuleUsage = `// feature.module.ts
@NgModule({
  imports: [
    CommonModule,
    FormsSharedModule  // Gets both modules + custom components
  ]
})
export class FeatureModule { }`;

  standaloneReactive = `import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule  // Import directly in component
  ],
  template: \`
    <form [formGroup]="form" (ngSubmit)="login()">
      <input formControlName="email" placeholder="Email">
      <input formControlName="password" type="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  \`
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  constructor(private fb: FormBuilder) {
  
  login() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}`;

  standaloneTemplateDriven = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule  // Import directly in component
  ],
  template: \`
    <input [(ngModel)]="searchTerm" placeholder="Search...">
    <button (click)="search()">Search</button>
  \`
})
export class SearchComponent {
  searchTerm = '';
  
  search() {
    console.log('Searching for:', this.searchTerm);
  }
}`;

  modernAngularInject = `import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modern-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name">
      <button type="submit">Submit</button>
    </form>
  \`
})
export class ModernFormComponent {
  private fb = inject(FormBuilder);  // inject() instead of constructor
  
  form = this.fb.group({
    name: ['', Validators.required]
  });
  
  submit() {
    console.log(this.form.value);
  }
}`;

  lazyLoadedModule = `// forms-feature.module.ts
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsFeatureRoutingModule
  ],
  declarations: [
    CreateFormComponent,
    EditFormComponent,
    FormListComponent
  ]
})
export class FormsFeatureModule { }

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'forms',
    loadChildren: () => import('./forms-feature/forms-feature.module')
      .then(m => m.FormsFeatureModule)
  }
];`;

  formsServiceModule = `// forms-core.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormValidationService } from './form-validation.service';
import { FormPersistenceService } from './form-persistence.service';

@NgModule({
  imports: [ReactiveFormsModule],
  exports: [ReactiveFormsModule]
})
export class FormsCoreModule {
  static forRoot(): ModuleWithProviders<FormsCoreModule> {
    return {
      ngModule: FormsCoreModule,
      providers: [
        FormValidationService,
        FormPersistenceService
      ]
    };
  }
}

// app.module.ts
@NgModule({
  imports: [
    FormsCoreModule.forRoot()  // Provides services at root
  ]
})
export class AppModule { }`;

  testingConfig = `// form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],  // Import for testing
      declarations: [FormComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  }
  
  it('should validate required fields', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });
});`;
}
