import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Exemple: Générateur d'Enquête Dynamique
 * 
 * Ce composant démontre:
 * - Génération dynamique de formulaires (Partie 4)
 * - Différents types de champs (text, radio, checkbox, select)
 * - Validation dynamique
 * - Résultats en temps réel
 * - Configuration externe pour créer des enquêtes
 */

interface SurveyQuestion {
  id: string;
  type: 'text' | 'radio' | 'checkbox' | 'select' | 'textarea';
  label: string;
  required: boolean;
  options?: { label: string; value: any }[];
  placeholder?: string;
  validators?: any[];
}

@Component({
  selector: 'app-survey-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.css',
})
export class SurveyFormComponent implements OnInit {
  surveyForm!: FormGroup;
  submitted = false;
  submittedData: any = null;

  // Configuration de l'enquête
  questions: SurveyQuestion[] = [
    {
      id: 'satisfaction',
      type: 'radio',
      label: 'Êtes-vous satisfait de nos services?',
      required: true,
      options: [
        { label: 'Très satisfait', value: 5 },
        { label: 'Satisfait', value: 4 },
        { label: 'Neutre', value: 3 },
        { label: 'Insatisfait', value: 2 },
        { label: 'Très insatisfait', value: 1 },
      ],
    },
    {
      id: 'features',
      type: 'checkbox',
      label: 'Quelles fonctionnalités appréciez-vous? (cochez les cases)',
      required: true,
      options: [
        { label: 'Interface utilisateur', value: 'ui' },
        { label: 'Performance', value: 'performance' },
        { label: 'Documentation', value: 'docs' },
        { label: 'Support client', value: 'support' },
        { label: 'Prix', value: 'price' },
      ],
    },
    {
      id: 'recommendation',
      type: 'radio',
      label: 'Recommanderiez-vous notre service à un ami?',
      required: true,
      options: [
        { label: 'Très probablement', value: 'very-likely' },
        { label: 'Probablement', value: 'likely' },
        { label: 'Peut-être', value: 'maybe' },
        { label: 'Probablement pas', value: 'unlikely' },
        { label: 'Pas du tout', value: 'very-unlikely' },
      ],
    },
    {
      id: 'improvements',
      type: 'textarea',
      label: 'Qu\'auriez-vous aimé améliorer?',
      required: false,
      placeholder: 'Vos suggestions...',
    },
    {
      id: 'contact',
      type: 'text',
      label: 'Votre email (pour suivre)',
      required: false,
      validators: [Validators.email],
      placeholder: 'votre@email.com',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Construire le formulaire dynamiquement
   */
  buildForm(): void {
    const formControls: any = {};

    this.questions.forEach((question) => {
      let validators: any[] = [];

      if (question.required) {
        validators.push(Validators.required);
      }

      if (question.validators) {
        validators = [...validators, ...question.validators];
      }

      if (question.type === 'checkbox') {
        // Pour checkbox multiple, créer un FormGroup
        const checkboxControls: any = {};
        question.options?.forEach((option) => {
          checkboxControls[option.value] = [false];
        });
        formControls[question.id] = this.fb.group(checkboxControls);
      } else {
        formControls[question.id] = ['', validators];
      }
    });

    this.surveyForm = this.fb.group(formControls);
  }

  /**
   * Obtenir les résultats de l'enquête
   */
  getResults(): any {
    if (!this.submittedData) {
      return null;
    }

    const results: any = {};

    this.questions.forEach((question) => {
      const value = this.submittedData[question.id];

      if (question.type === 'checkbox') {
        // Récupérer les cases cochées
        const selected = Object.keys(value)
          .filter((key) => value[key])
          .map((key) => {
            const option = question.options?.find((o) => o.value === key);
            return option?.label || key;
          });
        results[question.label] = selected.join(', ') || 'Aucune sélection';
      } else if (question.type === 'radio') {
        // Récupérer le label de l'option sélectionnée
        const option = question.options?.find((o) => o.value === value);
        results[question.label] = option?.label || value;
      } else {
        results[question.label] = value || 'Non répondu';
      }
    });

    return results;
  }

  /**
   * Gérer la soumission
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.surveyForm.valid) {
      this.submittedData = { ...this.surveyForm.value };
      console.log('Enquête soumise:', this.submittedData);
    }
  }

  /**
   * Réinitialiser l'enquête
   */
  resetSurvey(): void {
    this.surveyForm.reset();
    this.submitted = false;
    this.submittedData = null;
  }

  /**
   * Vérifier s'il faut afficher une erreur
   */
  hasError(questionId: string): boolean {
    const control = this.surveyForm.get(questionId);
    return this.submitted && control?.invalid || false;
  }

  /**
   * Obtenir le message d'erreur
   */
  getErrorMessage(question: SurveyQuestion): string {
    const control = this.surveyForm.get(question.id);

    if (!control?.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return `${question.label} est requise`;
    }

    if (control.hasError('email')) {
      return 'Veuillez entrer une adresse email valide';
    }

    return 'Erreur de validation';
  }

  /**
   * Helper pour obtenir un contrôle typé
   */
  getControl(questionId: string) {
    return this.surveyForm.get(questionId) as any;
  }
}
