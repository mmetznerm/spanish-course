# Espanhol — Mapas Mentais

Site estático, pronto para **GitHub Pages**, organizado para estudo no celular.

## O que tem

- **160 cartões individuais** extraídos dos dois PDFs
- busca por palavras
- filtros por categoria e coleção
- favoritos salvos no próprio navegador (`localStorage`)
- visualização ampliada de cada mapa

## Estrutura

```text
index.html
style.css
app.js
data.js
assets/
  full/
  thumb/
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, escolha:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (ou `master`)
   - **Folder:** `/root`
5. Salve.
6. Aguarde alguns minutos. O site ficará disponível em algo como:

```text
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

## Como testar localmente

Você pode abrir o `index.html` direto no navegador, mas é melhor usar um servidor local simples:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## Observação

Os cartões foram cortados em 4 partes por página para melhorar a leitura no celular.
