import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-form-classes-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule, CodeBlockComponent],
  templateUrl: './form-classes-chapter.component.html',
  styleUrls: ['./form-classes-chapter.component.css']
})
export class FormClassesChapterComponent {
  hierarchyDiagram = `┌─────────────────────────────────────────────────────────────────┐
│                    HIÉRARCHIE DES CLASSES                        │
└─────────────────────────────────────────────────────────────────┘

                      AbstractControl
                      (Classe de Base)
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    ┌───────────┐     ┌───────────┐      ┌───────────┐
    │FormControl│     │ FormGroup │      │ FormArray │
    │           │     │           │      │           │
    │ Valeur    │     │ Groupe de │      │ Tableau   │
    │ Unique    │     │ Contrôles │      │ de        │
    │           │     │ (par clé) │      │ Contrôles │
    └───────────┘     └───────────┘      └───────────┘`;

  importCode = `import { 
  FormControl, 
  FormGroup, 
  FormArray, 
  FormBuilder 
} from '@angular/forms';`;

  formControlConstructor = `new FormControl<T>(
  value: T,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
)`;

  formControlOptions = `interface FormControlOptions {
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  updateOn?: 'change' | 'blur' | 'submit';
  nonNullable?: boolean;
}`;

  formControlExamples = `// Création simple
const name = new FormControl('');

// Avec valeur initiale
const email = new FormControl('user@example.com');

// Avec validateurs
const password = new FormControl('', [
  Validators.required,
  Validators.minLength(8)
]);

// Avec validateurs synchrones et asynchrones
const username = new FormControl('', 
  [Validators.required],
  [this.checkUsernameAvailable.bind(this)]
);

// Avec objet de configuration
const age = new FormControl(18, {
  validators: [Validators.min(0), Validators.max(120)],
  updateOn: 'blur'
});

// Non-nullable (Angular 14+)
const requiredName = new FormControl('', {
  nonNullable: true,
  validators: Validators.required
});`;

  typedFormsExample = `// Typage explicite
const email = new FormControl<string>('');
const age = new FormControl<number | null>(null);

// Le type est inféré de la valeur initiale
const name = new FormControl('John');  // Type: FormControl<string | null>

// nonNullable supprime null du type
const required = new FormControl('', { nonNullable: true });
// Type: FormControl<string>`;

  emailInputExample = `@Component({
  selector: 'app-email-input',
  template: \`
    <input [formControl]="emailControl" placeholder="Email">
    <div *ngIf="emailControl.invalid && emailControl.touched">
      <span *ngIf="emailControl.hasError('required')">L'email est requis</span>
      <span *ngIf="emailControl.hasError('email')">Format email invalide</span>
    </div>
    <p>Valeur: {{ emailControl.value }}</p>
    <p>Statut: {{ emailControl.status }}</p>
  \`
})
export class EmailInputComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
}`;

  formGroupConstructor = `new FormGroup<T>(
  controls: T,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
)`;

  formGroupCreation = `// Création basique
const form = new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  email: new FormControl('')
});

// Avec validateurs de groupe
const form = new FormGroup({
  password: new FormControl(''),
  confirmPassword: new FormControl('')
}, {
  validators: passwordMatchValidator
});

// Groupes imbriqués
const form = new FormGroup({
  user: new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  }),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});`;

  formGroupAccess = `const form = new FormGroup({
  email: new FormControl(''),
  password: new FormControl('')
});

// Accès par get()
const emailControl = form.get('email');

// Accès aux contrôles imbriqués
const cityControl = form.get('address.city');
// ou
const cityControl = form.get(['address', 'city']);

// Accès direct (non typé)
const email = form.controls['email'];`;

  setValuePatchValue = `const form = new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  email: new FormControl('')
});

// setValue - DOIT fournir TOUTES les valeurs
form.setValue({
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.com'
});

// patchValue - peut fournir un sous-ensemble
form.patchValue({
  firstName: 'Jean'
  // lastName et email restent inchangés
});`;

  userFormExample = `@Component({
  selector: 'app-user-form',
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName" placeholder="Prénom">
      <input formControlName="lastName" placeholder="Nom">
      <input formControlName="email" placeholder="Email">
      
      <div formGroupName="address">
        <input formControlName="street" placeholder="Rue">
        <input formControlName="city" placeholder="Ville">
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">Envoyer</button>
    </form>
  \`
})
export class UserFormComponent {
  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl('')
    })
  });
  
  onSubmit() {
    console.log(this.userForm.value);
    // { firstName: '...', lastName: '...', email: '...', address: { street: '...', city: '...' } }
  }
}`;

  formArrayConstructor = `new FormArray<T>(
  controls: T[],
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
)`;

  formArrayManipulation = `// Création
const phones = new FormArray([
  new FormControl(''),
  new FormControl('')
]);

// Ajouter un contrôle
phones.push(new FormControl(''));

// Supprimer un contrôle à l'index
phones.removeAt(0);

// Insérer à une position
phones.insert(1, new FormControl('nouveau'));

// Effacer tout
phones.clear();

// Accéder par index
const firstPhone = phones.at(0);

// Longueur
console.log(phones.length);`;

  formArrayOfGroups = `const users = new FormArray([
  new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  }),
  new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  })
]);

// Ajouter un nouvel utilisateur
users.push(new FormGroup({
  name: new FormControl(''),
  email: new FormControl('')
}));`;

  phoneListExample = `@Component({
  selector: 'app-phone-list',
  template: \`
    <form [formGroup]="form">
      <h3>Numéros de téléphone</h3>
      
      <div formArrayName="phones">
        <div *ngFor="let phone of phonesArray.controls; let i = index">
          <input [formControlName]="i" placeholder="Téléphone {{ i + 1 }}">
          <button type="button" (click)="removePhone(i)">✕</button>
        </div>
      </div>
      
      <button type="button" (click)="addPhone()">+ Ajouter téléphone</button>
      
      <pre>{{ form.value | json }}</pre>
    </form>
  \`
})
export class PhoneListComponent {
  form = new FormGroup({
    phones: new FormArray([
      new FormControl('')
    ])
  });
  
  get phonesArray(): FormArray {
    return this.form.get('phones') as FormArray;
  }
  
  addPhone() {
    this.phonesArray.push(new FormControl(''));
  }
  
  removePhone(index: number) {
    this.phonesArray.removeAt(index);
  }
}`;

  formBuilderInjection = `import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({...})
export class MyComponent {
  private fb = inject(FormBuilder);
  
  // ou via constructeur
  // constructor(private fb: FormBuilder) {
}`;

  formBuilderShortSyntax = `// Sans FormBuilder
const form = new FormGroup({
  email: new FormControl('', Validators.required),
  password: new FormControl('', [Validators.required, Validators.minLength(8)])
});

// Avec FormBuilder
const form = this.fb.group({
  email: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(8)]]
});`;

  formBuilderFullSyntax = `const form = this.fb.group({
  // [valeur, validateurs sync, validateurs async]
  email: ['', [Validators.required, Validators.email], [asyncEmailValidator]],
  
  // Objet de configuration
  password: this.fb.control('', {
    validators: [Validators.required],
    updateOn: 'blur'
  }),
  
  // Groupe imbriqué
  address: this.fb.group({
    street: [''],
    city: ['', Validators.required]
  }),
  
  // Tableau
  phones: this.fb.array([
    [''],
    ['']
  ])
});`;

  nonNullableFormBuilder = `@Component({...})
export class MyComponent {
  private fb = inject(FormBuilder);
  
  // Tous les contrôles sont non-nullable
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.email]
  });
  
  resetForm() {
    // Reset retourne aux valeurs initiales (pas null)
    this.form.reset();
    // name = '', email = '' (pas null)
  }
}`;

  registrationExample = `@Component({
  selector: 'app-registration',
  template: \`
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <input formControlName="username" placeholder="Nom d'utilisateur">
      <input formControlName="email" type="email" placeholder="Email">
      
      <div formGroupName="password">
        <input formControlName="main" type="password" placeholder="Mot de passe">
        <input formControlName="confirm" type="password" placeholder="Confirmer">
      </div>
      
      <div formArrayName="skills">
        <div *ngFor="let skill of skills.controls; let i = index">
          <input [formControlName]="i" placeholder="Compétence {{ i + 1 }}">
          <button type="button" (click)="removeSkill(i)">✕</button>
        </div>
        <button type="button" (click)="addSkill()">+ Ajouter compétence</button>
      </div>
      
      <button type="submit" [disabled]="registrationForm.invalid">S'inscrire</button>
    </form>
  \`
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  
  registrationForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: this.fb.group({
      main: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }),
    skills: this.fb.array([
      ['']
    ])
  });
  
  get skills(): FormArray {
    return this.registrationForm.get('skills') as FormArray;
  }
  
  addSkill() {
    this.skills.push(this.fb.control(''));
  }
  
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
  
  passwordMatchValidator(group: FormGroup) {
    const main = group.get('main')?.value;
    const confirm = group.get('confirm')?.value;
    return main === confirm ? null : { mismatch: true };
  }
  
  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }
}`;

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
