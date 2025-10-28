import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-pwa-demo',
  template: `
    <div class="pwa-demo">
      <header class="pwa-header">
        <h1>📱 PWA Features Demo</h1>
        <p>Demonstração das funcionalidades Progressive Web App</p>
      </header>

      <div class="pwa-content">
        <!-- Status da Conexão -->
        <section class="pwa-section">
          <h2>🌐 Status da Conexão</h2>
          <div class="status-indicator">
            @if (pwaService.isOnline()) {
              <span class="status online">✅ Online</span>
            } @else {
              <span class="status offline">❌ Offline</span>
            }
          </div>
          
          @if (networkInfo) {
            <div class="network-info">
              <h3>Informações da Rede:</h3>
              <ul>
                <li><strong>Tipo:</strong> {{ networkInfo.effectiveType || 'Desconhecido' }}</li>
                <li><strong>Velocidade:</strong> {{ networkInfo.downlink || 'N/A' }} Mbps</li>
                <li><strong>Latência:</strong> {{ networkInfo.rtt || 'N/A' }} ms</li>
                <li><strong>Economia de dados:</strong> {{ networkInfo.saveData ? 'Ativada' : 'Desativada' }}</li>
              </ul>
            </div>
          }
        </section>

        <!-- Instalação do App -->
        <section class="pwa-section">
          <h2>📲 Instalação do Aplicativo</h2>
          
          @if (pwaService.isInstalled()) {
            <div class="app-status installed">
              <p>✅ Aplicativo já está instalado!</p>
              <p>Você está usando a versão PWA da aplicação.</p>
            </div>
          } @else {
            <div class="app-status not-installed">
              @if (pwaService.canInstall()) {
                <p>📱 Este aplicativo pode ser instalado no seu dispositivo!</p>
                <button 
                  class="btn btn-primary"
                  (click)="installApp()"
                >
                  Instalar Aplicativo
                </button>
              } @else {
                <p>ℹ️ A instalação não está disponível no momento.</p>
                <p><small>Abra esta página no Chrome/Edge para ver a opção de instalação.</small></p>
              }
            </div>
          }
        </section>

        <!-- Atualizações -->
        <section class="pwa-section">
          <h2>🔄 Atualizações</h2>
          
          @if (pwaService.updateAvailable()) {
            <div class="update-available">
              <p>🎉 Nova versão disponível!</p>
              <button 
                class="btn btn-primary"
                (click)="applyUpdate()"
              >
                Atualizar Agora
              </button>
            </div>
          } @else {
            <div class="update-status">
              <p>✅ Aplicação está atualizada</p>
              <button 
                class="btn btn-secondary"
                (click)="checkForUpdates()"
              >
                Verificar Atualizações
              </button>
            </div>
          }
        </section>

        <!-- Notificações -->
        <section class="pwa-section">
          <h2>🔔 Notificações</h2>
          
          <div class="notifications-demo">
            <p><strong>Status:</strong> {{ notificationStatus }}</p>
            
            <div class="notification-actions">
              <button 
                class="btn btn-primary"
                (click)="requestNotificationPermission()"
                [disabled]="notificationStatus === 'Concedida'"
              >
                Solicitar Permissão
              </button>
              
              <button 
                class="btn btn-secondary"
                (click)="showTestNotification()"
                [disabled]="notificationStatus !== 'Concedida'"
              >
                Testar Notificação
              </button>
            </div>
          </div>
        </section>

        <!-- Cache e Offline -->
        <section class="pwa-section">
          <h2>💾 Cache e Modo Offline</h2>
          
          <div class="cache-info">
            <p>O Service Worker está cacheando recursos automaticamente.</p>
            <p>Experimente:</p>
            <ol>
              <li>Navegue pelas páginas da aplicação</li>
              <li>Desconecte sua internet</li>
              <li>Recarregue a página - funcionará offline!</li>
            </ol>
            
            <button 
              class="btn btn-primary"
              (click)="preloadResources()"
            >
              Cachear Recursos Críticos
            </button>
          </div>
        </section>

        <!-- Recursos PWA -->
        <section class="pwa-section">
          <h2>⚡ Recursos PWA Implementados</h2>
          
          <div class="features-grid">
            <div class="feature-card">
              <h3>📱 Manifest</h3>
              <p>Arquivo de manifesto configurado com ícones e informações do app</p>
            </div>
            
            <div class="feature-card">
              <h3>🔄 Service Worker</h3>
              <p>Cache inteligente e funcionamento offline</p>
            </div>
            
            <div class="feature-card">
              <h3>🚀 App Shell</h3>
              <p>Interface básica carregada instantaneamente</p>
            </div>
            
            <div class="feature-card">
              <h3>🔔 Push Notifications</h3>
              <p>Notificações locais e push (preparado)</p>
            </div>
            
            <div class="feature-card">
              <h3>📲 Instalável</h3>
              <p>Pode ser instalado como app nativo</p>
            </div>
            
            <div class="feature-card">
              <h3>🌐 Offline First</h3>
              <p>Funciona mesmo sem conexão</p>
            </div>
          </div>
        </section>

        <!-- Como testar -->
        <section class="pwa-section">
          <h2>🧪 Como Testar PWA</h2>
          
          <div class="testing-guide">
            <h3>No Desktop (Chrome/Edge):</h3>
            <ol>
              <li>Abra o DevTools (F12)</li>
              <li>Vá na aba "Application" ou "Aplicativo"</li>
              <li>Veja "Service Workers", "Cache Storage", "Manifest"</li>
              <li>Use "Network" para simular offline</li>
            </ol>
            
            <h3>No Mobile:</h3>
            <ol>
              <li>Abra no Chrome/Safari</li>
              <li>Verá opção "Adicionar à tela inicial"</li>
              <li>Instale e use como app nativo</li>
              <li>Teste modo offline desconectando WiFi</li>
            </ol>
            
            <h3>Lighthouse PWA Score:</h3>
            <p>Execute o Lighthouse no DevTools para verificar a pontuação PWA!</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .pwa-demo {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: var(--color-text);
    }

    .pwa-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        color: var(--color-text);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text);
        opacity: 0.8;
        font-size: 1.1rem;
      }
    }

    .pwa-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .pwa-section {
      background: var(--color-background);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        color: var(--color-text);
        margin: 0 0 1.5rem 0;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 0.5rem;
      }

      h3 {
        color: var(--color-text);
        margin: 1rem 0 0.5rem 0;
      }
    }

    .status-indicator {
      margin-bottom: 1rem;

      .status {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 500;

        &.online {
          background: #d4edda;
          color: #155724;
        }

        &.offline {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }

    .network-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;

      ul {
        margin: 0.5rem 0 0 1rem;
        
        li {
          margin-bottom: 0.25rem;
        }
      }
    }

    .app-status {
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;

      &.installed {
        background: #d4edda;
        color: #155724;
      }

      &.not-installed {
        background: #d1ecf1;
        color: #0c5460;
      }
    }

    .update-available {
      background: #fff3cd;
      color: #856404;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .update-status {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .notifications-demo {
      .notification-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }
    }

    .cache-info {
      ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 6px;
      border: 1px solid #e9ecef;

      h3 {
        color: var(--color-primary);
        margin: 0 0 0.5rem 0;
      }

      p {
        margin: 0;
        color: var(--color-text);
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }

    .testing-guide {
      ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }

      h3 {
        color: var(--color-primary);
        margin: 1.5rem 0 0.5rem 0;

        &:first-child {
          margin-top: 1rem;
        }
      }

      p {
        font-weight: 500;
        color: var(--color-primary);
      }
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
      text-decoration: none;
      display: inline-block;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-primary) 80%, black);
        }
      }

      &.btn-secondary {
        background: var(--color-secondary);
        color: white;

        &:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-secondary) 80%, black);
        }
      }
    }

    @media (max-width: 768px) {
      .pwa-demo {
        padding: 1rem;
      }

      .pwa-section {
        padding: 1.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .notification-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaDemoComponent implements OnInit {
  readonly pwaService = inject(PwaService);
  
  networkInfo: any = null;
  notificationStatus = 'Desconhecida';

  ngOnInit(): void {
    this.networkInfo = this.pwaService.getNetworkInformation();
    this.updateNotificationStatus();
    this.pwaService.preloadCriticalResources();
  }

  installApp(): void {
    this.pwaService.promptInstall();
  }

  applyUpdate(): void {
    this.pwaService.applyUpdate();
  }

  checkForUpdates(): void {
    // Em uma aplicação real, chamaria o service worker para verificar
    alert('Verificando atualizações... (Simulado)');
  }

  async requestNotificationPermission(): Promise<void> {
    const granted = await this.pwaService.requestNotificationPermission();
    this.updateNotificationStatus();
    
    if (granted) {
      alert('Permissão para notificações concedida!');
    } else {
      alert('Permissão para notificações negada.');
    }
  }

  showTestNotification(): void {
    this.pwaService.showNotification('Teste PWA', {
      body: 'Esta é uma notificação de teste da aplicação Angular PWA!',
      tag: 'test-notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }

  preloadResources(): void {
    this.pwaService.preloadCriticalResources();
    alert('Recursos críticos cacheados com sucesso!');
  }

  private updateNotificationStatus(): void {
    if (!('Notification' in window)) {
      this.notificationStatus = 'Não suportada';
    } else {
      switch (Notification.permission) {
        case 'granted':
          this.notificationStatus = 'Concedida';
          break;
        case 'denied':
          this.notificationStatus = 'Negada';
          break;
        default:
          this.notificationStatus = 'Pendente';
      }
    }
  }
}