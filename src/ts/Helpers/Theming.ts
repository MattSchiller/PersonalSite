import { IThemeEnum } from "@Helpers/IThemeEnum";
import { getActiveTheme } from "@Redux/Store";

export function getInitialTheme(): IThemeEnum {
    return IThemeEnum.DARK_PLUS;
}
export function getThemedClassName(className: string, themeParam?: string): string {
    const theme = themeParam || getActiveTheme();
    return `${className} ${className}-${theme}`;
}

// Helpful to blend into props interfaces for components that need to be re-rendered on theme change.
export interface IThemedProps {
    activeTheme: IThemeEnum;
}
