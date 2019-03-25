import { getActiveTheme } from "@Redux/Store";

export function getThemedClassName(className: string, themeParam?: string): string {
    const theme = themeParam || getActiveTheme();
    return `${className} ${className}-${theme}`;
}
