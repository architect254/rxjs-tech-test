import { Injectable } from '@angular/core';
import { Option } from '../models/selection'

@Injectable({
  providedIn: 'root',
})
export class Options {
  private readonly options: Option[] = [
    { id: '+2', label: '+2', operation: '+2' },
    { id: '-.6', label: '-.6', operation: '-.6' },
    { id: '*6', label: '*6', operation: '*6' },
    { id: '/2', label: '/2', operation: '/2' },
    { id: '*.9', label: '*.9', operation: '*.9' },
    { id: '+5', label: '+5', operation: '+5' },
    { id: '-1', label: '-1', operation: '-1' }
  ];

  getOptions(): Option[] {
    return this.options;
  }
}
