# public/media — fotos e vídeos da trajetória

Solte os arquivos aqui com estes nomes; o site referencia por nome a partir de
`src/data/timeline.ts` (campo `media` de cada nó). Formatos: `.jpg`/`.webp`
para foto (≤ 1600 px de largura), `.mp4` (H.264) para vídeo, ≤ 10 MB cada.

| Arquivo                     | Nó       | O que é                                              | Status    |
| --------------------------- | -------- | ---------------------------------------------------- | --------- |
| `air-mouse.mp4`             | embedded | Air Mouse funcionando                                | ✔ no ar   |
| `air-mouse-poster.jpg`      | embedded | Frame do vídeo, usado como capa                      | ✔ no ar   |
| `spider-fpga.jpg`           | hardware | Terasic Spider                                       | ✔ no ar   |
| `vhdl-cpu.jpg`              | hardware | CPU em VHDL (placa, waveform ou diagrama)            | pendente  |
| `nuvu-helmet.jpg`           | origin   | Capacete do MIT NuVu (sem foto encontrada)           | opcional  |
| `cats-cambridge.jpg`        | origin   | CATS College Cambridge                               | opcional  |
| `els-canada.jpg`            | origin   | ELS Language Centers, Canadá                         | opcional  |

Arquivo ausente = nada renderiza; não há quebra. Se os certificados forem a única
evidência da origem, mande as fotos e eu monto uma imagem composta única,
com número de registro e data de nascimento ocultos.

Não coloque aqui: certificado do TOEFL (só a nota entra em `skills.ts`),
documentos com dados pessoais, nada da Zagros.
