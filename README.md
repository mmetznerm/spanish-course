# Language Gym — 610 frases para treinar idiomas

Projeto estático para treinar frases completas em português brasileiro, inglês e espanhol da Espanha. Não precisa de instalação, build, dependências ou backend.

## O que vem nesta versão

- 500 cartões novos em 10 blocos de 50 frases, com situações práticas para viver na Espanha.
- As 110 frases trilíngues originais preservadas.
- Áudio de pronúncia pelo recurso de síntese de voz do navegador (`es-ES`, `en-US` e `pt-BR`, conforme a disponibilidade do sistema).
- Links para abrir a tradução no Google Tradutor.
- Navegação pelos botões e pelas setas esquerda/direita do teclado.
- Salvamento do cartão atual no navegador.
- Layout responsivo para computador e celular.

## Os dez blocos novos

1. Conversação diária
2. Casa e aluguel
3. Trabalho e tecnologia
4. Supermercado e compras
5. Restaurante e café
6. Transporte e deslocações
7. Burocracia, NIE e TIE
8. Saúde e farmácia
9. Escola e família
10. Situações sociais

Os 500 cartões novos aparecem primeiro. Depois deles aparecem os 110 cartões originais.

## Executar localmente

Abra `index.html` no navegador. Não há dependências externas necessárias para estudar; a voz usa a síntese de voz disponível no navegador/sistema operacional.

## Publicar no GitHub Pages

1. Extraia este ZIP.
2. Abra seu repositório `mmetznerm/spanish-course` no GitHub.
3. Use **Add file → Upload files** e envie o conteúdo desta pasta para a raiz do repositório, mantendo a pasta `data/` e seus dois arquivos.
4. Faça commit das alterações.
5. Em **Settings → Pages**, configure a publicação pela branch `main` e pela raiz (`/root`). Se o GitHub Pages já estiver configurado, confira a URL após o commit.

A estrutura de arquivos deve ficar assim:

```text
index.html
app.js
styles.css
README.md
data/
  phrases.js
  survival-phrases.js
```

Não envie apenas o ZIP para dentro do repositório: extraia-o e envie os arquivos que estão dentro dele.
