import { TestBed } from '@angular/core/testing';

import { SelectionState } from './selection-state';

describe('SelectionState', () => {
  let service: SelectionState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
