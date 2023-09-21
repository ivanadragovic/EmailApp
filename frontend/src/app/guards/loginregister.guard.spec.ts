import { TestBed } from '@angular/core/testing';

import { LoginregisterGuard } from './loginregister.guard';

describe('LoginregisterGuard', () => {
  let guard: LoginregisterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginregisterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
