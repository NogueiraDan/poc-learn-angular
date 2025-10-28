import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { GlobalLoadingComponent } from './shared/components/global-loading.component';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, GlobalLoadingComponent],
  template: `
    <div class="app-container">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-global-loading />
      
      <!-- PWA Update Banner -->
      @if (pwaService.updateAvailable()) {
        <div class="pwa-update-banner">
          <div class="update-content">
            <span>🎉 Nova versão disponível!</span>
            <button 
              class="btn-update"
              (click)="pwaService.applyUpdate()"
            >
              Atualizar
            </button>
            <button 
              class="btn-dismiss"
              (click)="dismissUpdate()"
            >
              ✕
            </button>
          </div>
        </div>
      }
      
      <!-- PWA Install Banner -->
      @if (pwaService.canInstall() && !pwaService.isInstalled() && showInstallBanner()) {
        <div class="pwa-install-banner">
          <div class="install-content">
            <span>📱 Instalar este app no seu dispositivo?</span>
            <button 
              class="btn-install"
              (click)="installApp()"
            >
              Instalar
            </button>
            <button 
              class="btn-dismiss"
              (click)="dismissInstall()"
            >
              ✕
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('poc-learn-angular');
  protected readonly pwaService = inject(PwaService);
  protected showInstallBanner = signal(true);

  ngOnInit(): void {
    this.pwaService.preloadCriticalResources();
  }

  protected installApp(): void {
    this.pwaService.promptInstall();
    this.showInstallBanner.set(false);
  }

  protected dismissInstall(): void {
    this.showInstallBanner.set(false);
  }

  protected dismissUpdate(): void {
    // Em uma implementação real, você poderia salvar isso no localStorage
    console.log('Update dismissed');
  }
}
