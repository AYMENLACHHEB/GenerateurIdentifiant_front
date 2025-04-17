import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-generate-id',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './generate-id.component.html',
})
export class GenerateIdComponent implements OnInit {
  nom: string = '';
  prenom: string = '';
  dateNaissance: string = '';
  generatedId: string = '';

  configurations: {
    id: number;
    type: string;
    ordre: number;
    longueur: number;
    prefixe?: string;
    suffixe?: string;
    dateFormat?: string;
    compteurInitial?: number;
  }[] = [];

  // Nouveau modèle pour le formulaire d'ajout de configuration
  newConfig: {
    id: number;
    type: string;
    ordre: number;
    longueur: number;
    prefixe?: string;
    suffixe?: string;
    dateFormat?: string;
    compteurInitial?: number;
  } = {
    id:0,  
    type: '',
    ordre: 0,
    longueur: 0,
    prefixe: '',
    suffixe: '',
    dateFormat: '',
    compteurInitial: 1,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations() {
    this.http.get<any[]>('http://localhost:8282/api/generate').subscribe({
      next: (response) => {
        this.configurations = response;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des configurations :', err);
      }
    });
  }

  generateId() {
    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      dateNaissance: this.dateNaissance
    };

    this.http.post<any>('http://localhost:8282/api/generate', payload).subscribe({
      next: (response) => {
        this.generatedId = response.uniqueNumber;
      },
      error: (err) => {
        console.error('Erreur lors de la génération de l\'identifiant :', err);
      }
    });
  }

  // Méthode modifiée pour ajouter une configuration via une requête POST
  addConfigurationFromForm() {
    const payload = {
      id: null,
      type: this.newConfig.type,
      ordre: this.newConfig.ordre,
      longueur: this.newConfig.longueur,
      prefixe: this.newConfig.prefixe,
      suffixe: this.newConfig.suffixe,
      dateFormat: this.newConfig.dateFormat,
      compteurInitial: this.newConfig.compteurInitial,
    };

    // Requête POST vers l'URL appropriée pour l'ajout
    this.http.post<any>('http://localhost:8181/api/criteria', payload).subscribe({
      next: (response) => {
        this.loadConfigurations(); // Recharge les configurations après ajout
        this.resetNewConfig();     // Réinitialise le formulaire
        console.log('Configuration ajoutée avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la configuration :', err);
      }
    });
  }

  resetNewConfig() {
    this.newConfig = {
      id: 0,
      type: '',
      ordre: 0,
      longueur: 0,
      prefixe: '',
      suffixe: '',
      dateFormat: '',
      compteurInitial: 1,
    };
  }

  removeConfiguration(index: number) {
    const config = this.configurations[index];

    this.http.delete(`http://localhost:8181/api/criteria/${config.id}`).subscribe({
      next: () => {
        this.configurations.splice(index, 1);
      },
      error: (err) => {
        console.error(`Erreur lors de la suppression de l'élément ${config.id}`, err);
      }
    });
  }

  updateConfiguration(config: any) {
    const payload = {
      type: config.type,
      ordre: config.ordre,
      longueur: config.longueur,
      prefixe: config.prefixe,
      suffixe: config.suffixe,
      dateFormat: config.dateFormat,
      compteurInitial: config.compteurInitial
    };
  
    this.http.put<any>(`http://localhost:8181/api/criteria/${config.id}`, payload).subscribe({
      next: (response) => {
        console.log(`Configuration ${config.id} mise à jour avec succès.`);
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour de la configuration ${config.id}`, err);
      }
    });
  }
}
