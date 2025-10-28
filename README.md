# 🚀 Angular POC - Proof of Concept

Uma aplicação Angular moderna e completa demonstrando todos os conceitos essenciais para o mercado de trabalho. Construída com Angular 20+ e as melhores práticas atuais.

## 📋 Funcionalidades Implementadas

### 🎯 Core Angular Features
- ✅ **Standalone Components** - Arquitetura moderna sem NgModules
- ✅ **Signals** - Gerenciamento de estado reativo
- ✅ **New Control Flow** - `@if`, `@for`, `@switch` em templates
- ✅ **Dependency Injection** - Com `inject()` function
- ✅ **Reactive Forms** - Formulários tipados e validados
- ✅ **Router** - Roteamento com lazy loading
- ✅ **HttpClient** - Comunicação com APIs
- ✅ **Pipes** - Custom e built-in pipes
- ✅ **Services** - Arquitetura baseada em serviços

### 🔐 Autenticação e Autorização
- ✅ **AuthService** - Gerenciamento de autenticação com signals
- ✅ **Route Guards** - Proteção de rotas (auth, admin, guest)
- ✅ **JWT Token** - Simulação de autenticação baseada em token
- ✅ **Role-based Access** - Controle de acesso por perfis

### 🌐 HTTP e Interceptors
- ✅ **Auth Interceptor** - Adição automática de headers de autorização
- ✅ **Loading Interceptor** - Indicador global de carregamento
- ✅ **Error Interceptor** - Tratamento global de erros HTTP

### 📱 Progressive Web App (PWA)
- ✅ **Service Worker** - Cache inteligente e funcionamento offline
- ✅ **App Manifest** - Metadados para instalação
- ✅ **Install Prompt** - Banner de instalação personalizado
- ✅ **Update Notifications** - Notificações de novas versões
- ✅ **Offline Support** - Funcionamento sem conexão
- ✅ **Push Notifications** - Suporte a notificações locais
- ✅ **Network Detection** - Monitoramento do status da conexão

### 🎨 UI/UX Modernas
- ✅ **Theme System** - Sistema de temas claro/escuro
- ✅ **CSS Variables** - Tematização dinâmica
- ✅ **Responsive Design** - Layout adaptativo
- ✅ **Modern CSS** - CSS Grid, Flexbox, Animations

### 🧪 Testes
- ✅ **Unit Tests** - Testes para services, pipes e components
- ✅ **Jasmine/Karma** - Framework de testes configurado
- ✅ **Test Coverage** - Cobertura de código

## 🚀 Quick Start

### Pré-requisitos
```bash
Node.js 18+ 
npm 9+
Angular CLI 20+
```

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd poc-learn-angular

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
ng serve
```

### Acesso
- **URL:** http://localhost:4200
- **Login Demo:** admin@test.com / password123
- **Login User:** user@test.com / password123

## 📁 Estrutura do Projeto

```
src/app/
├── core/                    # Funcionalidades principais
│   ├── guards/             # Route guards (auth, admin, guest)
│   ├── interceptors/       # HTTP interceptors
│   └── services/           # Serviços globais (auth, theme, loading, pwa)
├── features/               # Módulos de funcionalidades
│   ├── auth/              # Autenticação (login, unauthorized)
│   ├── admin/             # Painel administrativo
│   ├── dashboard/         # Dashboard principal
│   ├── forms/             # Demonstração de formulários
│   ├── users/             # Gerenciamento de usuários
│   └── pwa/               # Demonstração PWA
├── shared/                 # Componentes compartilhados
│   ├── components/        # Header, loading, user-card
│   └── pipes/             # Pipes customizados
└── app.config.ts          # Configuração da aplicação
```

## 🔐 Sistema de Autenticação

### Usuários Demo
| Email | Senha | Perfil | Acesso |
|-------|-------|--------|---------|
| admin@test.com | password123 | admin | Todas as páginas |
| user@test.com | password123 | user | Páginas básicas |

### Guards Implementados
- **authGuard**: Protege rotas que requerem login
- **adminGuard**: Protege rotas administrativas
- **guestGuard**: Redireciona usuários logados (ex: página de login)

## 📱 PWA Features

### Funcionalidades Offline
- ✅ Cache de recursos estáticos
- ✅ Cache de rotas navegadas
- ✅ Fallback offline para páginas não cacheadas
- ✅ Detecção de status online/offline

### Instalação
- ✅ Banner de instalação customizado
- ✅ Suporte a diferentes plataformas
- ✅ Ícones adaptativos (iOS, Android, Desktop)

### Atualizações
- ✅ Detecção automática de atualizações
- ✅ Prompt de atualização personalizado
- ✅ Atualização em background

### Como Testar PWA

#### Desktop (Chrome/Edge):
1. Abra DevTools (F12)
2. Vá em "Application" > "Manifest"
3. Teste "Add to homescreen"
4. Use "Network" para simular offline

#### Mobile:
1. Acesse pelo Chrome/Safari mobile
2. Menu > "Adicionar à tela inicial"
3. Use como app nativo
4. Teste offline desconectando WiFi

#### Lighthouse Score:
Execute Lighthouse no DevTools para verificar a pontuação PWA!

## 🧪 Executando Testes

```bash
# Executar todos os testes
ng test

# Executar testes com coverage
ng test --code-coverage

# Executar testes em modo watch
ng test --watch
```

### Testes Implementados
- ✅ AuthService - Login, logout, guards
- ✅ ThemeService - Troca de temas
- ✅ TruncatePipe - Pipe customizado
- ✅ UserCardComponent - Componente de usuário

## 🎯 Conceitos Angular Demonstrados

### Modern Angular (20+)
- **Standalone Components**: Sem NgModules
- **Signals**: Estado reativo (`signal()`, `computed()`, `effect()`)
- **New Control Flow**: `@if`, `@for`, `@switch`
- **inject()**: Injeção de dependência funcional
- **input()/output()**: Propriedades de componente com signals

### Patterns e Best Practices
- **Feature-based Architecture**: Organização por funcionalidades
- **Reactive Programming**: RxJS e Signals
- **Lazy Loading**: Carregamento sob demanda
- **Error Handling**: Tratamento global de erros
- **Type Safety**: TypeScript estrito
- **Performance**: OnPush change detection

### Real-world Features
- **Authentication Flow**: Login/logout completo
- **Authorization**: Controle de acesso por roles
- **Form Validation**: Validações reativas
- **HTTP Handling**: Interceptors e error handling
- **State Management**: Signals para estado local/global
- **Theme System**: Temas dinâmicos
- **PWA**: Aplicação web progressiva completa

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                # ng serve
npm run build           # ng build
npm run watch           # ng build --watch
npm test               # ng test

# PWA
npm run build:prod     # Build para produção com PWA
npm run serve:pwa      # Servir build PWA localmente
```

## 📚 Recursos Utilizados

### Tecnologias
- **Angular 20+** - Framework principal
- **TypeScript 5+** - Linguagem
- **RxJS 7+** - Programação reativa
- **Angular PWA** - Service Worker e Manifest
- **Jasmine/Karma** - Testes unitários

### Angular Features
- Router, HttpClient, Forms, Animations
- Service Worker, CDK, Common
- Signals, Standalone Components
- New Control Flow, inject()

## 🎯 Para Quem Serve

### 📍 Nível Junior
- Conceitos básicos de Angular
- Componentes e serviços
- Routing e forms básicos
- TypeScript essencial

### 📍 Nível Pleno (Implementado)
- ✅ Arquitetura avançada
- ✅ Guards e interceptors
- ✅ Testes unitários
- ✅ PWA completo
- ✅ Best practices

### 📍 Nível Senior (Próximos passos)
- Micro-frontends
- Server-side rendering (SSR)
- Testes E2E
- CI/CD pipeline
- Performance optimization avançada

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**💡 Dica**: Este projeto foi criado como uma POC educacional para demonstrar conceitos essenciais do Angular para o mercado de trabalho. Use-o como referência e ponto de partida para seus próprios projetos!

**🚀 Próximos Passos**: 
- [ ] Implementar SSR (Server-Side Rendering)
- [ ] Adicionar testes E2E com Cypress
- [ ] Implementar micro-frontends
- [ ] Adicionar CI/CD com GitHub Actions
- [ ] Implementar notificações push reais
