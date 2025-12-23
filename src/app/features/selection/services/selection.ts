import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { OptionsService } from '../../../core/services/options';
import { BoxSelection, Option } from '../../../shared/models/selection.models';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private optionsService = inject(OptionsService);

  private selections$ = new BehaviorSubject<BoxSelection[]>([]);
  private activeBoxId$ = new BehaviorSubject<number | null>(null);

  selections = this.selections$.asObservable();
  activeBoxId = this.activeBoxId$.asObservable();

  constructor() {
    this.initData();
  }

  private initData() {
    const saved = localStorage.getItem('gym-data');
    const parsed: BoxSelection[] = saved ? JSON.parse(saved) : [];

    if (parsed && parsed.length > 0) {
      this.selections$.next(parsed);
    } else {
      this.reset(); 
    }
  }

  total$ = this.selections$.pipe(
    map(selections => {
      const map = this.optionsService.getOptionsMap();
      return selections.reduce((acc, s) => acc + (s.optionLabel ? map.get(s.optionLabel)?.value ?? 0 : 0), 0);
    })
  );

  getSelectionForBox(id: number): Observable<BoxSelection | undefined> {
    return this.selections$.pipe(
      map(selections => selections.find(s => s.boxId === id))
    );
  }

  setActiveBox(id: number | null) {
    this.activeBoxId$.next(id);
  }

  updateSelection(boxId: number, option: Option) {
    const updated = this.selections$.value.map(s =>
      s.boxId === boxId
        ? { ...s, optionLabel: option.label, optionValue: option.value }
        : s
    );
    this.selections$.next(updated);
    localStorage.setItem('gym-data', JSON.stringify(updated));

    // Auto-advance logic
    if (boxId < 10) {
      this.activeBoxId$.next(boxId + 1);
    }
  }

  reset() {
    const empty: BoxSelection[] = Array.from({ length: 10 }, (_, i) => ({
      boxId: i + 1,
      optionLabel: null,
      optionValue: null
    }));
    this.selections$.next(empty);
    localStorage.setItem('gym-data', JSON.stringify(empty));
    this.activeBoxId$.next(null);
  }
}