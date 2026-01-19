import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-directives-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule, CodeBlockComponent],
  templateUrl: './directives-chapter.component.html',
  styleUrls: ['./directives-chapter.component.css']
})
export class DirectivesChapterComponent {
  // Code snippets as component properties
  diagramDirectives = `┌─────────────────────────────────────────────────────────────────┐
│                    DIRECTIVES DE FORMULAIRES                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐    ┌─────────────────────────────┐
│     REACTIVE FORMS          │    │    TEMPLATE-DRIVEN          │
├─────────────────────────────┤    ├─────────────────────────────┤
│                             │    │                             │
│  formGroup                  │    │  ngForm                     │
│  formControlName            │    │  ngModel                    │
│  formGroupName              │    │  ngModelGroup               │
│  formArrayName              │    │                             │
│  [formControl]              │    │                             │
│                             │    │                             │
└─────────────────────────────┘    └─────────────────────────────┘`;

  codeFormGroup = `import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="profileForm">
      <!-- contrôles du formulaire -->
    </form>
  \`
})
export class ProfileComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  });
}`;

  codeFormControlName = `<form [formGroup]="profileForm">
  <input formControlName="firstName" placeholder="Prénom">
  <input formControlName="lastName" placeholder="Nom">
</form>`;

  codeFormGroupName = `@Component({
  template: \`
    <form [formGroup]="userForm">
      <input formControlName="username">
      
      <div formGroupName="address">
        <input formControlName="street" placeholder="Rue">
        <input formControlName="city" placeholder="Ville">
        <input formControlName="postalCode" placeholder="Code Postal">
      </div>
    </form>
  \`
})
export class UserComponent {
  userForm = new FormGroup({
    username: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      postalCode: new FormControl('')
    })
  });
}`;

  codeFormArrayName = `@Component({
  template: \`
    <form [formGroup]="orderForm">
      <div formArrayName="items">
        <div *ngFor="let item of items.controls; let i = index">
          <input [formControlName]="i" placeholder="Article {{ i + 1 }}">
        </div>
      </div>
    </form>
  \`
})
export class OrderComponent {
  orderForm = new FormGroup({
    items: new FormArray([
      new FormControl(''),
      new FormControl('')
    ])
  });
  
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
}`;

  codeFormControl = `@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="searchControl" placeholder="Rechercher...">
    <p>Recherche : {{ searchControl.value }}</p>
  \`
})
export class SearchComponent {
  searchControl = new FormControl('');
  
  ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
      console.log('Valeur de recherche :', value);
    });
  }
}`;

  codeNgForm = `import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: \`
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <!-- contrôles -->
      <button type="submit" [disabled]="myForm.invalid">Envoyer</button>
    </form>
  \`
})
export class MyComponent {
  onSubmit(form: NgForm) {
    console.log('Valeurs du formulaire :', form.value);
    console.log('Formulaire valide :', form.valid);
  }
}`;

  codeNgModelReadOnly = `<input [ngModel]="userName" name="userName">`;

  codeNgModelTwoWay = `@Component({
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="user.name" name="name" placeholder="Nom">
    <input [(ngModel)]="user.email" name="email" placeholder="Email">
    <p>Bonjour, {{ user.name }}!</p>
  \`
})
export class UserComponent {
  user = {
    name: '',
    email: ''
  };
}`;

  codeNgModelValidation = `<input 
  [(ngModel)]="email" 
  name="email"
  required
  email
  #emailField="ngModel">
  
<div *ngIf="emailField.invalid && emailField.touched">
  <span *ngIf="emailField.errors?.['required']">L'email est requis</span>
  <span *ngIf="emailField.errors?.['email']">Format email invalide</span>
</div>`;

  codeNgModelGroup = `@Component({
  imports: [FormsModule],
  template: \`
    <form #userForm="ngForm">
      <input [(ngModel)]="user.name" name="name" placeholder="Nom">
      
      <div ngModelGroup="address">
        <input [(ngModel)]="user.address.street" name="street" placeholder="Rue">
        <input [(ngModel)]="user.address.city" name="city" placeholder="Ville">
      </div>
      
      <pre>{{ userForm.value | json }}</pre>
    </form>
  \`
})
export class UserFormComponent {
  user = {
    name: '',
    address: {
      street: '',
      city: ''
    }
  };
}`;

  codeNgModelGroupOutput = `{
  "name": "Jean Dupont",
  "address": {
    "street": "123 Rue de Paris",
    "city": "Paris"
  }
}`;

  diagramDecision = `┌─────────────────────────────────────────────────────────────────┐
│                ARBRE DE DÉCISION - DIRECTIVES                    │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │ Formulaire Réactif│
                    │   ou Template ?   │
                    └────────┬─────────┘
                             │
           ┌─────────────────┴─────────────────┐
           │                                   │
           ▼                                   ▼
    ┌────────────┐                      ┌────────────┐
    │  Reactive  │                      │  Template  │
    │   Forms    │                      │   Driven   │
    └─────┬──────┘                      └─────┬──────┘
          │                                   │
          ▼                                   ▼
    Utiliser:                           Utiliser:
    • [formGroup]                       • ngForm (auto)
    • formControlName                   • [(ngModel)]
    • formGroupName                     • ngModelGroup
    • formArrayName                     • name="..."
    • [formControl]`;

  codeTemplateForm = `@Component({
  imports: [FormsModule],
  template: \`
    <form #f="ngForm" (ngSubmit)="save(f.value)">
      <input [(ngModel)]="user.name" name="name" required>
      <div ngModelGroup="contact">
        <input [(ngModel)]="user.contact.email" name="email" email>
        <input [(ngModel)]="user.contact.phone" name="phone">
      </div>
      <button [disabled]="f.invalid">Sauvegarder</button>
    </form>
  \`
})
export class TemplateFormComponent {
  user = { name: '', contact: { email: '', phone: '' } };
  save(value: any) { console.log(value); }
}`;

  codeReactiveForm = `@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="save()">
      <input formControlName="name">
      <div formGroupName="contact">
        <input formControlName="email">
        <input formControlName="phone">
      </div>
      <button [disabled]="form.invalid">Sauvegarder</button>
    </form>
  \`
})
export class ReactiveFormComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    contact: new FormGroup({
      email: new FormControl('', Validators.email),
      phone: new FormControl('')
    })
  });
  
  save() { console.log(this.form.value); }
}`;

  codeBadMixing = `<!-- ❌ INCORRECT - Ne pas mélanger Reactive et Template-Driven -->
<form [formGroup]="myForm">
  <input [(ngModel)]="name" name="name">
</form>

<!-- ✅ CORRECT - Une seule approche -->
<form [formGroup]="myForm">
  <input formControlName="name">
</form>`;

  codeBadName = `<!-- ❌ INCORRECT -->
<input [(ngModel)]="name">

<!-- ✅ CORRECT -->
<input [(ngModel)]="name" name="name">`;

  codeTemplateRef = `<!-- Accéder au contrôle dans le template -->
<input formControlName="email" #emailInput>
<input ngModel name="email" #emailCtrl="ngModel">

<!-- emailCtrl.errors, emailCtrl.valid, etc. -->`;

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
