import { Component } from '@angular/core';
import { GenerateIdComponent } from './generate-id/generate-id.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, GenerateIdComponent],
  template: `<app-generate-id></app-generate-id>`,
})
export class AppComponent {}
