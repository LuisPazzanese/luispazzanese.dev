# public/media — fotos e vídeos da trajetória

Solte os arquivos aqui com estes nomes; o site referencia por nome a partir de
`src/data/timeline.ts` (campo `media` de cada nó). Formatos: `.jpg`/`.webp`
para foto (≤ 1600 px de largura), `.mp4` (H.264) para vídeo, ≤ 10 MB cada.

| Arquivo                  | Nó         | O que é                                         |
| ------------------------ | ---------- | ----------------------------------------------- |
| `cats-cambridge.jpg`     | origin     | CATS College Cambridge (6 meses)                |
| `els-canada.jpg`         | origin     | ELS Language Centers, Canadá (1 mês)            |
| `nuvu-helmet.jpg`        | origin     | Capacete retrátil contra chuva ácida (MIT NuVu) |
| `air-mouse.mp4`          | embedded   | Air Mouse funcionando                           |
| `air-mouse-poster.jpg`   | embedded   | Frame do vídeo, usado como capa                 |
| `spider-fpga.jpg`        | hardware   | Terasic Spider (foto ou vídeo `spider-fpga.mp4`)|
| `vhdl-cpu.jpg`           | hardware   | CPU em VHDL (diagrama, placa ou simulação)      |

Não coloque aqui: certificado do TOEFL (só a nota entra em `skills.ts`),
documentos com dados pessoais, nada da Zagros.
