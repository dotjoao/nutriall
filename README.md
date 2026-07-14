# Marina Duarte — Nutrição Esportiva

Landing page premium para nutricionista esportivo. Dark editorial, tipografia
Fraunces + Inter, acento verde-lima único, zero dependências.

## Rodar localmente

Qualquer servidor estático serve. Sem Node/Python instalado, use o incluso:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1
# → http://localhost:4173
```

## Estrutura

```
index.html            página única (semântica, acessível)
assets/css/style.css  design system completo (custom properties)
assets/js/main.js     interações (~3 KB, sem dependências)
```

## Decisões de performance

- Apenas `transform` e `opacity` em animações (GPU-accelerated).
- `IntersectionObserver` para reveals e contadores; `requestAnimationFrame`
  com throttle para parallax e navbar.
- Imagens com `width`/`height` explícitos (zero layout shift), `loading="lazy"`
  fora da dobra, `fetchpriority="high"` no hero.
- Ruído via SVG data-URI inline (sem request extra).
- `prefers-reduced-motion` desativa todo movimento.

## Personalização rápida

- **Cores**: variáveis em `:root` no topo do CSS (`--accent`, `--bg`, `--ink`).
- **Fotos**: URLs Unsplash em `index.html` — trocar pelas fotos reais do
  profissional (manter os atributos `width`/`height`).
- **Contato**: o CTA final aponta para `mailto:` — trocar por WhatsApp ou
  formulário conforme o funil real.
