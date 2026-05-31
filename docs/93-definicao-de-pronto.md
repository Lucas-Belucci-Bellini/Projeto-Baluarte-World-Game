# 93 — Definição de pronto

Uma fatia/Era está "pronta" quando:

- [ ] **Jogável fim a fim** no navegador, com objetivo e vitória claros.
- [ ] **Testada por outra pessoa** (não só autor/IA).
- [ ] **Sem regressão**: a Era 0 e as anteriores continuam funcionando.
- [ ] **Dados em JSON** + invariantes validados (`npm test` verde).
- [ ] **Build do Vite** OK (`npm run build`).
- [ ] **Versionada**: branch de versão criada + `main` atualizado (ver [91](91-versionamento-e-branches.md)).
- [ ] **Documentada**: doc da Era atualizado com o que entrou.
- [ ] (Opcional) vídeo curto (~30s) de demonstração.

## Paridade
Se houver versão 3D, ela dá a **mesma pontuação** que a web para a mesma
sequência. Ver [83](83-web-para-3d.md).
