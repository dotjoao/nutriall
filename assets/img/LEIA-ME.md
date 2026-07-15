# Foto da Hero

Salve a foto oficial do profissional (aquela com fundo escuro e anel de luz
verde) neste diretório com o nome exato:

```
assets/img/hero.webp
```

- Formato recomendado: **WebP** (ou AVIF, ajustando o `src` no `index.html`).
- Dimensões de referência: **1416 × 760** (as mesmas declaradas em
  `width`/`height` no `<img>` — se usar outra proporção, atualize os
  atributos para manter CLS zero).
- A página funciona sem a foto (um fallback com glow é exibido), mas a
  composição final depende dela.

Para converter um PNG/JPG para WebP:

```bash
cwebp -q 82 hero.png -o hero.webp
```
