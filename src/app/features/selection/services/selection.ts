import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, combineLatest, Observable } from 'rxjs';
import { OptionsService } from '../../../core/services/options';
import { BoxSelection } from '../../../shared/models/selection.models';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private optionsService = inject(OptionsService);

  private selections$ = new BehaviorSubject<BoxSelection[]>(
    JSON.parse(localStorage.getItem('gym-data') || '[]')
  );
  private activeBoxId$ = new BehaviorSubject<number | null>(null);

  selections = this.selections$.asObservable();
  activeBoxId = this.activeBoxId$.asObservable();

  total$ = this.selections$.pipe(
    map(selections => {
      const map = this.optionsService.getOptionsMap();
      return selections.reduce((acc, s) => acc + (s.optionLabel ? map.get(s.optionLabel)?.value ?? 0 : 0), 0);
    })
  );

  // Helper: Get Selection for a specific box
  getSelectionForBox(id: number): Observable<BoxSelection | undefined> {
    return this.selections$.pipe(
      // We map the entire array to find just the one box we care about
      map(selections => selections.find(s => s.boxId === id))
    );
  }

  // Helper: Get Subtotal up to a box
  getSubtotalForBox(id: number): Observable<number> {
    return this.selections$.pipe(
      map(list => {
        const map = this.optionsService.getOptionsMap();
        return list.filter(s => s.boxId <= id)
          .reduce((acc, s) => acc + (s.optionLabel ? map.get(s.optionLabel)?.value ?? 0 : 0), 0);
      })
    );
  }

  // Methods
  setActiveBox(id: number | null) { this.activeBoxId$.next(id); }

  updateSelection(boxId: number, label: string) {
    const updated = this.selections$.value.map(s => s.boxId === boxId ? { ...s, optionLabel: label } : s);
    this.selections$.next(updated);
    localStorage.setItem('gym-data', JSON.stringify(updated));
    if (boxId < 10) this.activeBoxId$.next(boxId + 1);
  }

  reset() {
    const empty = Array.from({ length: 10 }, (_, i) => ({ boxId: i + 1, optionLabel: null }));
    this.selections$.next(empty);
    localStorage.setItem('gym-data', JSON.stringify(empty));
    this.activeBoxId$.next(null);
  }
}