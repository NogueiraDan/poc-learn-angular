import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  private readonly _loadingCount = signal(0);

  // Getter público readonly
  readonly isLoading = this._isLoading.asReadonly();

  show(): void {
    this._loadingCount.update(count => count + 1);
    this._isLoading.set(true);
  }

  hide(): void {
    this._loadingCount.update(count => Math.max(0, count - 1));
    
    // Só esconde quando não há mais requests pendentes
    if (this._loadingCount() === 0) {
      this._isLoading.set(false);
    }
  }

  // Força esconder (útil para casos de erro)
  forceHide(): void {
    this._loadingCount.set(0);
    this._isLoading.set(false);
  }

  // Getter para debug
  get loadingCount(): number {
    return this._loadingCount();
  }
}