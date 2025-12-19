import { Component, signal } from '@angular/core';
import { Box } from './components/box/box';
import { OptionSelector } from './components/option-selector/option-selector';
import { ResetButton } from './components/reset-button/reset-button';
import { SelectionState } from './services/selection-state';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, DecimalPipe, Box,
    OptionSelector,
    ResetButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rxjs-tech-test');
  readonly boxIds = Array.from({ length: 10 }, (_, i) => i + 1);
  constructor(public readonly state: SelectionState) {
  }
}
