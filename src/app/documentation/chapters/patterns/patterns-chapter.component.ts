import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-patterns-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule, CodeBlockComponent],
  templateUrl: './patterns-chapter.component.html',
  styleUrls: ['./patterns-chapter.component.css']
})
export class PatternsChapterComponent {
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

  overviewDiagram = `┌─────────────────────────────────────────────────────────────────┐
│                   FORM PATTERNS SPECTRUM                         │
└─────────────────────────────────────────────────────────────────┘

  Simple ◄───────────────────────────────────────────────► Complex
     │                                                         │
     │  Two-Way Binding                                        │
     │  (ngModel)                                              │
     │       │                                                 │
     │       └─────► Model-Driven                              │
     │               (Reactive Forms)                          │
     │                    │                                    │
     │                    └─────► Dynamic Forms                │
     │                            (Config-Based)               │
     │                                 │                       │
     │                                 └─────► Form Factory    │
     │                                        (Reusable)       │
     └─────────────────────────────────────────────────────────┘`;

  twoWayBindingDiagram = `┌──────────────────────────────────────────────────────────────┐
│                 TWO-WAY BINDING FLOW                          │
└──────────────────────────────────────────────────────────────┘

         Component                      Template
      ┌─────────────┐                ┌─────────────┐
      │   model =   │ ────────────►  │   <input    │
      │   { name:   │   Property     │   [(ngModel)]│
      │   'John' }  │   Binding      │   ="model.  │
      │             │                │     name">  │
      │             │ ◄────────────  │             │
      │             │   Event        │             │
      │             │   Binding      │             │
      └─────────────┘                └─────────────┘
                      │          │
                      │ [(ngModel)] = [ngModel] + (ngModelChange)
                      │
                      ▼
            ┌─────────────────┐
            │  Model always   │
            │  equals view    │
            └─────────────────┘`;

  twoWayBindingCode = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserModel {
  firstName: string;
  lastName: string;
  email: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-simple-form',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <form #userForm="ngForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>First Name</label>
        <input 
          name="firstName" 
          [(ngModel)]="user.firstName" 
          required
          #firstName="ngModel"
        >
        @if (firstName.invalid && firstName.touched) {
          <span class="error">
            First name is required
          </span>
        }
      </div>
      
      <div class="form-group">
        <label>Last Name</label>
        <input 
          name="lastName" 
          [(ngModel)]="user.lastName" 
          required
        >
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input 
          name="email" 
          [(ngModel)]="user.email" 
          required 
          email
          type="email"
        >
      </div>
      
      <div class="form-group">
        <label>
          <input 
            type="checkbox" 
            name="newsletter" 
            [(ngModel)]="user.newsletter"
          >
          Subscribe to newsletter
        </label>
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">
        Submit
      </button>
      
      <!-- Debug: Live model view -->
      <pre>{{ user | json }}</pre>
    </form>
  \`
})
export class SimpleFormComponent {
  user: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    newsletter: false
  };
  
  onSubmit() {
    console.log('Submitting:', this.user);
    // Model is already synchronized
  }
}`;

  modelDrivenDiagram = `┌──────────────────────────────────────────────────────────────┐
│                  MODEL-DRIVEN ARCHITECTURE                    │
└──────────────────────────────────────────────────────────────┘

     Component Class                     Template
    ┌─────────────────┐              ┌─────────────────┐
    │                 │              │                 │
    │  FormGroup {    │◄────────────►│ [formGroup]     │
    │    controls: {  │  Directive   │                 │
    │      email,     │  Binding     │ formControlName │
    │      password   │              │                 │
    │    }            │              │                 │
    │  }              │              │                 │
    │                 │              │                 │
    │  • setValue()   │              │ <input>         │
    │  • patchValue() │              │ <select>        │
    │  • reset()      │              │ <button>        │
    │  • valueChanges │              │                 │
    └─────────────────┘              └─────────────────┘
           │
           ▼
    ┌─────────────────┐
    │ Single Source   │
    │ of Truth        │
    │ (Component)     │
    └─────────────────┘`;

  modelDrivenCode = `import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Username</label>
        <input formControlName="username">
        @if (username.invalid && username.touched) {
          <div class="errors">
            @if (username.hasError('required')) {
              <span>Required</span>
            }
            @if (username.hasError('minlength')) {
              <span>
                Min {{ username.getError('minlength').requiredLength }} characters
              </span>
            }
          </div>
        }
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input formControlName="email" type="email">
        @if (email.invalid && email.touched) {
          <div class="errors">
            @if (email.hasError('required')) {
              <span>Required</span>
            }
            @if (email.hasError('email')) {
              <span>Invalid email</span>
            }
          </div>
        }
      </div>
      
      <div formGroupName="passwords" class="form-group">
        <label>Password</label>
        <input formControlName="password" type="password">
        
        <label>Confirm Password</label>
        <input formControlName="confirm" type="password">
        
        @if (passwords.hasError('mismatch')) {
          <div class="errors">
            Passwords do not match
          </div>
        }
      </div>
      
      <button type="submit" [disabled]="form.invalid">
        Register
      </button>
    </form>
  \`
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator })
  });
  
  // Getters for easy template access
  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }
  get passwords() { return this.form.get('passwords')!; }
  
  ngOnInit() {
    // React to form changes
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      console.log('Form changed:', value);
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return password === confirm ? null : { mismatch: true };
  }
  
  onSubmit() {
    if (this.form.valid) {
      const { username, email, passwords } = this.form.value;
      console.log('Submitting:', { username, email, password: passwords?.password });
    }
  }
}`;

  immutabilityDiagram = `┌──────────────────────────────────────────────────────────────┐
│                   IMMUTABILITY PATTERN                        │
└──────────────────────────────────────────────────────────────┘

  ┌─────────────┐                      ┌─────────────┐
  │ State V1    │                      │ State V2    │
  │ { name: 'A' }│ ───── setValue ────►│ { name: 'B' }│
  └─────────────┘    (new object)      └─────────────┘
        │                                     │
        │  Original                           │  New reference
        │  unchanged                          │  triggers change
        │                                     │  detection
        ▼                                     ▼
  Can compare                           OnPush works
  references                            efficiently`;

  immutableFormCode = `import { Component, computed, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-immutable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="save()">
      <input formControlName="name" placeholder="Name">
      <input formControlName="email" placeholder="Email">
      <select formControlName="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      
      <div class="actions">
        <button type="submit" [disabled]="!hasChanges()">Save</button>
        <button type="button" (click)="revert()">Revert</button>
      </div>
      
      <div class="status">
        <p>Original: {{ originalData() | json }}</p>
        <p>Current: {{ currentData() | json }}</p>
        <p>Has Changes: {{ hasChanges() }}</p>
      </div>
    </form>
  \`
})
export class ImmutableFormComponent {
  private fb = inject(FormBuilder);
  
  // Original data (immutable reference)
  originalData = signal<UserFormData>({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  });
  
  form = this.fb.nonNullable.group({
    name: [this.originalData().name, Validators.required],
    email: [this.originalData().email, [Validators.required, Validators.email]],
    role: [this.originalData().role]
  });
  
  // Current form data as signal
  currentData = signal<UserFormData>(this.form.getRawValue());
  
  // Computed signal for change detection
  hasChanges = computed(() => {
    const original = this.originalData();
    const current = this.currentData();
    return JSON.stringify(original) !== JSON.stringify(current);
  });
  
  constructor() {
    // Update current data signal on form changes
    this.form.valueChanges.subscribe(value => {
      this.currentData.set(value as UserFormData);
    });
  }
  
  save() {
    if (this.form.valid && this.hasChanges()) {
      const newData = this.form.getRawValue();
      
      // Create new immutable reference
      this.originalData.set({ ...newData });
      
      console.log('Saved:', newData);
    }
  }
  
  revert() {
    // Reset to original immutable state
    this.form.reset(this.originalData());
  }
}`;

  ngrxFormCode = `import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators } from '@angular/forms';
import { selectUserData } from './store/user.selectors';
import { UserActions } from './store/user.actions';

@Component({
  selector: 'app-ngrx-form',
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name">
      <input formControlName="email">
      <button type="submit">Update</button>
    </form>
  \`
})
export class NgrxFormComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor() {
    // Populate form from store (immutable)
    this.store.select(selectUserData).subscribe(userData => {
      if (userData) {
        this.form.patchValue(userData, { emitEvent: false });
      }
    });
  }
  
  submit() {
    if (this.form.valid) {
      // Dispatch action with new immutable state
      this.store.dispatch(UserActions.updateUser({ 
        user: { ...this.form.value } 
      }));
    }
  }
}`;

  dynamicFormConfigCode = `interface FormFieldConfig {
  key: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';
  label: string;
  value?: any;
  required?: boolean;
  validators?: ValidatorFn[];
  options?: { value: any; label: string }[];  // For select
  placeholder?: string;
  disabled?: boolean;
  order?: number;
}

interface FormConfig {
  title: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
}`;

  dynamicFormServiceCode = `import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}
  
  createForm(config: FormFieldConfig[]): FormGroup {
    const group: { [key: string]: any } = {};
    
    config.forEach(field => {
      const validators = this.getValidators(field);
      group[field.key] = [
        { value: field.value ?? '', disabled: field.disabled ?? false },
        validators
      ];
    });
    
    return this.fb.group(group);
  }
  
  private getValidators(field: FormFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    
    if (field.required) {
      validators.push(Validators.required);
    }
    
    if (field.type === 'email') {
      validators.push(Validators.email);
    }
    
    if (field.validators) {
      validators.push(...field.validators);
    }
    
    return validators;
  }
}`;

  dynamicFormComponentCode = `import { Component, Input, Output, EventEmitter, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormService } from './dynamic-form.service';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2>{{ config.title }}</h2>
      
      @for (field of sortedFields; track field.key) {
        <div class="form-field">
          <label [for]="field.key">{{ field.label }}</label>
          
          <!-- Text, Email, Number inputs -->
          @if (['text', 'email', 'number'].includes(field.type)) {
            <input 
              [id]="field.key"
              [formControlName]="field.key"
              [type]="field.type"
              [placeholder]="field.placeholder || ''"
            >
          }
          
          <!-- Select dropdown -->
          @if (field.type === 'select') {
            <select [id]="field.key" [formControlName]="field.key">
              <option value="">Select...</option>
              @for (opt of field.options; track opt.value) {
                <option [value]="opt.value">
                  {{ opt.label }}
                </option>
              }
            </select>
          }
          
          <!-- Textarea -->
          @if (field.type === 'textarea') {
            <textarea 
              [id]="field.key" 
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            ></textarea>
          }
          
          <!-- Checkbox -->
          @if (field.type === 'checkbox') {
            <input 
              type="checkbox" 
              [id]="field.key" 
              [formControlName]="field.key"
            >
          }
          
          <!-- Validation errors -->
          @if (isInvalid(field.key)) {
            <div class="error">
              @if (hasError(field.key, 'required')) {
                <span>{{ field.label }} is required</span>
              }
              @if (hasError(field.key, 'email')) {
                <span>Invalid email format</span>
              }
            </div>
          }
        </div>
      }
      </div>
      
      <button type="submit" [disabled]="form.invalid">
        {{ config.submitLabel || 'Submit' }}
      </button>
    </form>
  \`
})
export class DynamicFormComponent implements OnChanges {
  @Input() config!: FormConfig;
  @Output() formSubmit = new EventEmitter<any>();
  
  private dynamicFormService = inject(DynamicFormService);
  
  form!: FormGroup;
  
  get sortedFields(): FormFieldConfig[] {
    return [...this.config.fields].sort((a, b) => 
      (a.order ?? 0) - (b.order ?? 0)
    );
  }
  
  ngOnChanges() {
    if (this.config) {
      this.form = this.dynamicFormService.createForm(this.config.fields);
    }
  }
  
  isInvalid(key: string): boolean {
    const control = this.form.get(key);
    return control ? control.invalid && control.touched : false;
  }
  
  hasError(key: string, error: string): boolean {
    return this.form.get(key)?.hasError(error) ?? false;
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}`;

  dynamicFormUsageCode = `@Component({
  selector: 'app-survey',
  template: \`
    <app-dynamic-form 
      [config]="surveyConfig" 
      (formSubmit)="onSurveySubmit($event)"
    ></app-dynamic-form>
  \`
})
export class SurveyComponent {
  surveyConfig: FormConfig = {
    title: 'Customer Survey',
    submitLabel: 'Submit Survey',
    fields: [
      { 
        key: 'name', 
        type: 'text', 
        label: 'Full Name', 
        required: true,
        order: 1
      },
      { 
        key: 'email', 
        type: 'email', 
        label: 'Email Address', 
        required: true,
        order: 2
      },
      { 
        key: 'satisfaction', 
        type: 'select', 
        label: 'Satisfaction Level',
        options: [
          { value: 1, label: 'Very Unsatisfied' },
          { value: 2, label: 'Unsatisfied' },
          { value: 3, label: 'Neutral' },
          { value: 4, label: 'Satisfied' },
          { value: 5, label: 'Very Satisfied' }
        ],
        required: true,
        order: 3
      },
      { 
        key: 'comments', 
        type: 'textarea', 
        label: 'Additional Comments',
        placeholder: 'Tell us more...',
        order: 4
      },
      { 
        key: 'subscribe', 
        type: 'checkbox', 
        label: 'Subscribe to updates',
        value: false,
        order: 5
      }
    ]
  };
  
  onSurveySubmit(data: any) {
    console.log('Survey submitted:', data);
  }
}`;

  multiStepConfigCode = `interface FormStep {
  id: string;
  title: string;
  fields: FormFieldConfig[];
  isValid?: () => boolean;
}

interface WizardConfig {
  steps: FormStep[];
  allowSkip?: boolean;
  showProgress?: boolean;
}`;

  multiStepComponentCode = `import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <!-- Progress indicator -->
    <div class="progress">
      @for (step of steps; track step; let i = $index) {
        <div 
          class="step"
          [class.active]="i === currentStep"
          [class.completed]="i < currentStep"
          (click)="goToStep(i)"
        >
          <span class="number">{{ i + 1 }}</span>
          <span class="title">{{ step.title }}</span>
        </div>
      }
    </div>
    
    <!-- Form -->
    <form [formGroup]="form">
      <!-- Step 1: Personal Info -->
      @if (currentStep === 0) {
        <div class="step-content">
          <h3>Personal Information</h3>
          <div formGroupName="personal">
            <label>First Name</label>
            <input formControlName="firstName">
            
            <label>Last Name</label>
            <input formControlName="lastName">
            
            <label>Email</label>
            <input formControlName="email" type="email">
          </div>
        </div>
      }
      
      <!-- Step 2: Address -->
      @if (currentStep === 1) {
        <div class="step-content">
          <h3>Address</h3>
          <div formGroupName="address">
            <label>Street</label>
            <input formControlName="street">
          
          <label>City</label>
          <input formControlName="city">
          
          <label>Zip Code</label>
          <input formControlName="zip">
        </div>
      </div>
      }
      
      <!-- Step 3: Review -->
      @if (currentStep === 2) {
        <div class="step-content">
          <h3>Review Your Information</h3>
          <pre>{{ form.value | json }}</pre>
        </div>
      }
      
      <!-- Navigation -->
      <div class="navigation">
        <button 
          type="button" 
          (click)="previousStep()" 
          [disabled]="currentStep === 0"
        >
          Previous
        </button>
        
        <button 
          *ngIf="currentStep < steps.length - 1"
          type="button" 
          (click)="nextStep()" 
          [disabled]="!isCurrentStepValid()"
        >
          Next
        </button>
        
        <button 
          *ngIf="currentStep === steps.length - 1"
          type="button" 
          (click)="submit()"
          [disabled]="form.invalid"
        >
          Submit
        </button>
      </div>
    </form>
  \`
})
export class MultiStepFormComponent {
  @Output() formComplete = new EventEmitter<any>();
  
  private fb = inject(FormBuilder);
  
  currentStep = 0;
  
  steps = [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'review', title: 'Review' }
  ];
  
  form = this.fb.group({
    personal: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\\d{5}$/)]]
    })
  });
  
  isCurrentStepValid(): boolean {
    const stepKeys = ['personal', 'address'];
    const currentKey = stepKeys[this.currentStep];
    
    if (!currentKey) return true; // Review step
    
    const group = this.form.get(currentKey) as FormGroup;
    return group?.valid ?? true;
  }
  
  nextStep() {
    if (this.isCurrentStepValid() && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  goToStep(step: number) {
    // Only allow going to completed or current steps
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
  }
  
  submit() {
    if (this.form.valid) {
      this.formComplete.emit(this.form.value);
    }
  }
}`;

  formFactoryServiceCode = `import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormFactoryService {
  private fb = inject(FormBuilder);
  
  // User registration form
  createRegistrationForm(data?: Partial<UserRegistration>): FormGroup {
    return this.fb.group({
      username: [data?.username ?? '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: [data?.email ?? '', [
        Validators.required,
        Validators.email
      ]],
      password: [data?.password ?? '', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Address subform
  createAddressForm(data?: Partial<Address>): FormGroup {
    return this.fb.group({
      street: [data?.street ?? '', Validators.required],
      city: [data?.city ?? '', Validators.required],
      state: [data?.state ?? '', Validators.required],
      zip: [data?.zip ?? '', [
        Validators.required,
        Validators.pattern(/^\\d{5}(-\\d{4})?$/)
      ]],
      country: [data?.country ?? 'US']
    });
  }
  
  // Order form with nested address
  createOrderForm(data?: Partial<Order>): FormGroup {
    return this.fb.group({
      orderNumber: [data?.orderNumber ?? this.generateOrderNumber()],
      customer: this.fb.group({
        name: [data?.customer?.name ?? '', Validators.required],
        email: [data?.customer?.email ?? '', [Validators.required, Validators.email]],
        phone: [data?.customer?.phone ?? '']
      }),
      shippingAddress: this.createAddressForm(data?.shippingAddress),
      billingAddress: this.createAddressForm(data?.billingAddress),
      sameAsShipping: [true],
      items: this.fb.array([]),
      notes: ['']
    });
  }
  
  // Validators
  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
  
  private generateOrderNumber(): string {
    return \`ORD-\${Date.now()}\`;
  }
}`;

  factoryUsageCode = `@Component({
  selector: 'app-checkout',
  template: \`
    <form [formGroup]="orderForm" (ngSubmit)="placeOrder()">
      <!-- Customer info -->
      <section formGroupName="customer">
        <h3>Customer Information</h3>
        <input formControlName="name" placeholder="Name">
        <input formControlName="email" placeholder="Email">
        <input formControlName="phone" placeholder="Phone">
      </section>
      
      <!-- Shipping address -->
      <section formGroupName="shippingAddress">
        <h3>Shipping Address</h3>
        <app-address-fields></app-address-fields>
      </section>
      
      <label>
        <input type="checkbox" formControlName="sameAsShipping">
        Billing same as shipping
      </label>
      
      <!-- Billing address (if different) -->
      <section *ngIf="!orderForm.get('sameAsShipping')?.value" formGroupName="billingAddress">
        <h3>Billing Address</h3>
        <app-address-fields></app-address-fields>
      </section>
      
      <button type="submit" [disabled]="orderForm.invalid">Place Order</button>
    </form>
  \`
})
export class CheckoutComponent {
  private formFactory = inject(FormFactoryService);
  
  orderForm = this.formFactory.createOrderForm();
  
  placeOrder() {
    if (this.orderForm.valid) {
      const order = this.orderForm.value;
      
      // Copy shipping to billing if same
      if (order.sameAsShipping) {
        order.billingAddress = { ...order.shippingAddress };
      }
      
      console.log('Placing order:', order);
    }
  }
}`;

  onPushOptimizationCode = `import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  ChangeDetectorRef 
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-optimized-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,  // Key optimization
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name">
      <input formControlName="email">
      
      <!-- Use async pipe for automatic updates -->
      <div *ngIf="nameValue$ | async as name">
        Preview: {{ name }}
      </div>
      
      <!-- Status using async pipe -->
      <p>Form Status: {{ status$ | async }}</p>
      
      <button 
        type="submit" 
        [disabled]="(isInvalid$ | async)"
      >
        Submit
      </button>
    </form>
  \`
})
export class OptimizedFormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  // Observables for async pipe (triggers change detection automatically)
  nameValue$ = this.form.get('name')!.valueChanges.pipe(
    startWith(this.form.get('name')!.value)
  );
  
  status$ = this.form.statusChanges.pipe(
    startWith(this.form.status)
  );
  
  isInvalid$ = this.form.statusChanges.pipe(
    startWith(this.form.status),
    map(status => status === 'INVALID')
  );
  
  submit() {
    if (this.form.valid) {
      console.log('Submitting:', this.form.value);
    }
  }
}`;

  onPushBestPracticesCode = `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushFormComponent {
  private cdr = inject(ChangeDetectorRef);
  
  // ✓ Use observables with async pipe
  formValue$ = this.form.valueChanges;
  
  // ✓ Or manually trigger change detection when needed
  updateFormExternally(data: any) {
    this.form.patchValue(data);
    this.cdr.markForCheck();  // Trigger change detection
  }
  
  // ✓ Use immutable updates
  replaceData(newData: FormData) {
    this.form.reset(newData);
    this.cdr.markForCheck();
  }
}`;
}
