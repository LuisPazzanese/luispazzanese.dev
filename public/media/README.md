# public/media: mídia das figuras

Os arquivos são referenciados por nome em `src/data/projects.ts` (`figures[].media`). Arquivo ausente vira moldura vazia, sem quebrar o build.

| Arquivo | Figura | O que é | Status |
| --- | --- | --- | --- |
| `gesture-controller.mp4` | FIG. 1 | Controle por gestos jogando Subway Surfers (H.264, 474×850, 49 s) | ✔ no ar |
| `gesture-controller-poster.jpg` | FIG. 1 | Frame do vídeo, usado como capa | ✔ no ar |
| `mips-cpu.svg` | FIG. 2 | Datapath da CPU MIPS, desenhado a partir das entidades VHDL do repo | ✔ no ar |
| `stepper-ip.svg` | FIG. 3 | Diagrama de blocos do IP de motor de passo | ✔ no ar |

Os SVGs carregam um `<style>` com variante escura (`prefers-color-scheme`), que também vale quando são carregados como `<img>`. Mantenha as cores iguais aos tokens de `src/styles/global.css`.

Uma foto real da DE0-CV rodando a CPU pode substituir o diagrama da FIG. 2 (`.jpg`, até 1600 px de largura).
