# Rafael Duarte — Nutrição Esportiva

Landing page premium para nutricionista esportivo. Dark tech (estética
Apple/Stripe/Linear), tipografia Inter, verde usado como luz — nunca como
área chapada. Zero dependências.

## Rodar localmente

Qualquer servidor estático serve:

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

Sem Node/Python instalado, use o incluso:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1
```

## Estrutura

```
index.html            página única (semântica, acessível, WCAG 2.2 AA)
assets/css/style.css  design system completo (custom properties)
assets/js/main.js     interações (~4 KB, sem dependências)
assets/img/hero.webp  foto oficial do profissional (ver assets/img/LEIA-ME.md)
```

## Foto da Hero

A foto oficial do profissional deve ser salva em `assets/img/hero.webp`
(instruções em `assets/img/LEIA-ME.md`). No desktop ela ancora à direita,
fundida à composição por máscaras e glow; no mobile vira o fundo da Hero
com degradê progressivo para garantir contraste do texto.

## Decisões de performance

- Apenas `transform` e `opacity` em animações (GPU-accelerated).
- `IntersectionObserver` para reveals e contadores; `requestAnimationFrame`
  para navbar, parallax e glow do cursor.
- `width`/`height` explícitos na imagem + `preload` com `fetchpriority="high"`
  (zero layout shift, LCP rápido).
- Ruído e favicon via SVG data-URI inline (sem requests extras).
- `prefers-reduced-motion` desativa todo movimento.

## Personalização rápida

- **Cores**: tokens em `:root` no topo do CSS (`--green-*`, `--bg-*`).
- **Contato**: CTA final aponta para `mailto:` e `wa.me` — trocar pelo
  e-mail/WhatsApp reais (buscar por `rafaelduarte.nutri.br` e `5500000000000`).
- **Nome/CRN**: "Rafael Duarte" e o CRN do rodapé são placeholders — buscar
  e substituir no `index.html`.
