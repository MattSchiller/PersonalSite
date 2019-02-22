export enum IThemesEnum {
    SUBLIME_MONOKAI = "sublime-monokai",
    OTHER = "other"
}

export function getThemedClassName(className: string): string {
    return `${className} ${className}-${IThemesEnum.SUBLIME_MONOKAI}`;
}
