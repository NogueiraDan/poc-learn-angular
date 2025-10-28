import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-global-loading',
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    .loading-spinner {
      background: var(--color-background);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      color: var(--color-text);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    p {
      margin: 0;
      font-weight: 500;
      color: var(--color-text);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoadingComponent {
  readonly loadingService = inject(LoadingService);
}