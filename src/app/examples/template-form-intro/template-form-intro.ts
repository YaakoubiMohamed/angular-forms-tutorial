import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Exemple: Introduction aux Formulaires Pilotés par Modèle
 * 
 * Ce composant démontre:
 * - Formulaire piloté par modèle avec directive ngForm
 * - Liaison bilatérale avec ngModel
 * - Directives de validation intégrées (required, email, minlength, pattern)
 * - Suivi de l'état du formulaire via variable de référence de template
 * - Soumission du formulaire avec données
 * 
 * Concepts Clés:
 * 1. Le formulaire est défini en HTML (approche template-centric)
 * 2. Utilise les directives ngForm et ngModel
 * 3. La validation est spécifiée comme attributs HTML
 * 4. L'état du formulaire est accessible via des variables de référence de template
 * 5. Liaison bilatérale simple avec [(ngModel)]
 */
@Component({
  selector: 'app-template-form-intro',
  imports: [FormsModule, CommonModule],
  templateUrl: './template-form-intro.html',
  styleUrl: './template-form-intro.css',
})
export class TemplateFormIntro {
  // Modèle de données pour la liaison bilatérale
  formData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      birthDate: '',
    },
    contactInfo: {
      email: '',
      phone: '',
      website: '',
    },
    passwords: {
      password: '',
      confirmPassword: '',
    },
    acceptTerms: false,
  };

  // Suivi de la soumission
  submitted = false;
  submittedData: any = null;
  submitError: string | null = null;

  // Pays disponibles pour le dropdown
  countries = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'États-Unis' },
    { code: 'DE', name: 'Allemagne' },
  ];

  /**
   * Gérer la soumission du formulaire
   * Le paramètre form est la référence NgForm du template
   */
  onSubmit(form: NgForm): void {
    this.submitted = true;
    this.submitError = null;

    // Vérifier si le formulaire est valide avant la soumission
    if (form.valid && this.passwordsMatch()) {
      console.log('Formulaire soumis avec données:', this.formData);
      this.submittedData = JSON.parse(JSON.stringify(this.formData));
    } else {
      console.log('Le formulaire est invalide ou les mots de passe ne correspondent pas');
      if (!this.passwordsMatch()) {
        this.submitError = 'Les mots de passe ne correspondent pas';
      } else {
        this.submitError = 'Veuillez corriger les erreurs du formulaire';
      }
    }
  }

  /**
   * Réinitialiser le formulaire à son état initial
   */
  resetForm(form: NgForm): void {
    form.reset();
    this.formData = {
      personalInfo: {
        firstName: '',
        lastName: '',
        birthDate: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        website: '',
      },
      passwords: {
        password: '',
        confirmPassword: '',
      },
      acceptTerms: false,
    };
    this.submitted = false;
    this.submittedData = null;
    this.submitError = null;
  }

  /**
   * Pré-remplir le formulaire avec des données de démonstration
   */
  prefillForm(): void {
    this.formData = {
      personalInfo: {
        firstName: 'Marie',
        lastName: 'Dupont',
        birthDate: '1992-03-15',
      },
      contactInfo: {
        email: 'marie.dupont@example.com',
        phone: '+33 6 98 76 54 32',
        website: 'https://mariedupont.com',
      },
      passwords: {
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!',
      },
      acceptTerms: true,
    };
  }

  /**
   * Vérifier que les mots de passe correspondent
   */
  passwordsMatch(): boolean {
    return this.formData.passwords.password === this.formData.passwords.confirmPassword;
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string, errorType: string): string {
    const messages: { [key: string]: { [key: string]: string } } = {
      firstName: {
        required: 'Le prénom est requis',
        minlength: 'Le prénom doit avoir au moins 2 caractères',
      },
      lastName: {
        required: 'Le nom est requis',
        minlength: 'Le nom doit avoir au moins 2 caractères',
      },
      birthDate: {
        required: 'La date de naissance est requise',
      },
      email: {
        required: 'L\'email est requis',
        email: 'Veuillez entrer une adresse email valide',
      },
      phone: {
        required: 'Le téléphone est requis',
        pattern: 'Le format du téléphone est invalide',
      },
      website: {
        pattern: 'L\'URL du site web est invalide',
      },
      password: {
        required: 'Le mot de passe est requis',
        minlength: 'Le mot de passe doit avoir au moins 8 caractères',
      },
      confirmPassword: {
        required: 'Vous devez confirmer votre mot de passe',
        minlength: 'Le mot de passe confirmé doit avoir au moins 8 caractères',
      },
      acceptTerms: {
        required: 'Vous devez accepter les conditions d\'utilisation',
      },
    };

    return messages[fieldName]?.[errorType] || 'Erreur de validation';
  }

  /**
   * Obtenir l'état du formulaire pour le débogage
   */
  getFormState(form: NgForm): any {
    return {
      valid: form.valid,
      invalid: form.invalid,
      dirty: form.dirty,
      touched: form.touched,
      pristine: form.pristine,
      untouched: form.untouched,
      submitted: this.submitted,
    };
  }

  /**
   * Clear form data
   */
  clearForm(): void {
    this.formData = {
      personalInfo: {
        firstName: '',
        lastName: '',
        birthDate: ''
      },
      contactInfo: {
        email: '',
        phone: '',
        website: ''
      },
      passwords: {
        password: '',
        confirmPassword: ''
      },
      acceptTerms: false
    };
  }
}
