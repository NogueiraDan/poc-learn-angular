import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly swPush = inject(SwPush);
  private readonly router = inject(Router);

  // Signals para controle de estado
  private readonly _isOnline = signal(navigator.onLine);
  private readonly _updateAvailable = signal(false);
  private readonly _installPromptEvent = signal<any>(null);
  private readonly _isInstalled = signal(false);

  // Getters públicos readonly
  readonly isOnline = this._isOnline.asReadonly();
  readonly updateAvailable = this._updateAvailable.asReadonly();
  readonly canInstall = signal(() => !!this._installPromptEvent());
  readonly isInstalled = this._isInstalled.asReadonly();

  constructor() {
    this.setupOnlineStatusMonitoring();
    this.setupUpdateMonitoring();
    this.setupInstallPromptMonitoring();
    this.checkIfInstalled();
  }

  // Monitorar status de conexão
  private setupOnlineStatusMonitoring(): void {
    window.addEventListener('online', () => {
      this._isOnline.set(true);
      this.notifyUser('Conexão restaurada!', 'success');
    });

    window.addEventListener('offline', () => {
      this._isOnline.set(false);
      this.notifyUser('Modo offline ativado', 'warning');
    });
  }

  // Monitorar atualizações do Service Worker
  private setupUpdateMonitoring(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        switch (event.type) {
          case 'VERSION_DETECTED':
            console.log('Nova versão detectada:', event.version);
            break;
          case 'VERSION_READY':
            this._updateAvailable.set(true);
            this.notifyUser(
              'Nova versão disponível! Clique para atualizar.',
              'info',
              () => this.applyUpdate()
            );
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.error('Falha ao instalar nova versão:', event.error);
            this.notifyUser('Falha ao atualizar a aplicação', 'error');
            break;
        }
      });

      // Verificar por atualizações a cada 30 segundos
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 30000);
    }
  }

  // Monitorar prompt de instalação
  private setupInstallPromptMonitoring(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this._installPromptEvent.set(event);
      
      // Mostrar notificação após 5 segundos
      setTimeout(() => {
        this.notifyUser(
          'Instale o aplicativo para melhor experiência!',
          'info',
          () => this.promptInstall()
        );
      }, 5000);
    });

    window.addEventListener('appinstalled', () => {
      this._isInstalled.set(true);
      this._installPromptEvent.set(null);
      this.notifyUser('Aplicativo instalado com sucesso!', 'success');
    });
  }

  // Verificar se já está instalado
  private checkIfInstalled(): void {
    // Verificar se é PWA instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isRunningStandalone = (navigator as any).standalone === true;
    
    if (isStandalone || isRunningStandalone) {
      this._isInstalled.set(true);
    }
  }

  // Aplicar atualização
  async applyUpdate(): Promise<void> {
    if (this.swUpdate.isEnabled && this._updateAvailable()) {
      try {
        await this.swUpdate.activateUpdate();
        window.location.reload();
      } catch (error) {
        console.error('Erro ao aplicar atualização:', error);
        this.notifyUser('Erro ao aplicar atualização', 'error');
      }
    }
  }

  // Mostrar prompt de instalação
  async promptInstall(): Promise<void> {
    const promptEvent = this._installPromptEvent();
    if (promptEvent) {
      try {
        const result = await promptEvent.prompt();
        console.log('Resultado do prompt de instalação:', result);
        
        if (result.outcome === 'accepted') {
          this.notifyUser('Instalação iniciada...', 'info');
        }
        
        this._installPromptEvent.set(null);
      } catch (error) {
        console.error('Erro ao mostrar prompt de instalação:', error);
      }
    }
  }

  // Verificar se push notifications são suportadas
  get pushNotificationsSupported(): boolean {
    return this.swPush.isEnabled;
  }

  // Solicitar permissão para notificações
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Mostrar notificação local
  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });
    }
  }

  // Sistema de notificações interno da app
  private notifyUser(
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info',
    action?: () => void
  ): void {
    // Em uma aplicação real, você usaria um service de toast/snackbar
    const notification = document.createElement('div');
    notification.className = `pwa-notification pwa-notification-${type}`;
    notification.innerHTML = `
      <div class="pwa-notification-content">
        <span>${message}</span>
        ${action ? '<button class="pwa-notification-action">Ação</button>' : ''}
        <button class="pwa-notification-close">×</button>
      </div>
    `;

    // Adicionar estilos se não existirem
    if (!document.querySelector('#pwa-notifications-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pwa-notifications-styles';
      styles.textContent = `
        .pwa-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          color: white;
          font-family: system-ui, sans-serif;
          animation: slideIn 0.3s ease-out;
        }
        
        .pwa-notification-success { background: #4caf50; }
        .pwa-notification-error { background: #f44336; }
        .pwa-notification-warning { background: #ff9800; }
        .pwa-notification-info { background: #2196f3; }
        
        .pwa-notification-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .pwa-notification-action,
        .pwa-notification-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .pwa-notification-close {
          margin-left: auto;
          width: 24px;
          height: 24px;
          padding: 0;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }

    // Event listeners
    const closeBtn = notification.querySelector('.pwa-notification-close');
    const actionBtn = notification.querySelector('.pwa-notification-action');

    closeBtn?.addEventListener('click', () => {
      notification.remove();
    });

    if (actionBtn && action) {
      actionBtn.addEventListener('click', () => {
        action();
        notification.remove();
      });
    }

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Obter informações da rede
  getNetworkInformation(): any {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    
    return null;
  }

  // Forçar cache de recursos importantes
  async preloadCriticalResources(): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('poc-angular-v1');
        await cache.addAll([
          '/',
          '/dashboard',
          '/users',
          '/forms',
          '/manifest.webmanifest'
        ]);
        console.log('Recursos críticos cacheados');
      } catch (error) {
        console.error('Erro ao cachear recursos:', error);
      }
    }
  }
}