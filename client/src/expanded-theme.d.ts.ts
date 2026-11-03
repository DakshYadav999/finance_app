// /.d.ts is a declaration file, used to describe and extend existing TypeScript types.

import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface PaletteColor {
        [key: number]: string;
    }

    interface Palette {
        tertiary: PaletteColor;
    }

    interface PaletteOptions {
        tertiary?: PaletteColor;
    }
}
