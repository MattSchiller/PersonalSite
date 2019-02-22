export enum IThemesEnum {
    DARK_PLUS = "darkPlus",
    CAPO_LIGHT = "capoLight"
}

export function getThemedClassName(className: string): string {
    return `${className} ${className}-${IThemesEnum.CAPO_LIGHT}`;
}
