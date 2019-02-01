const theme = "sublime-monokai";

export function getThemedClassName(className: string): string {
    return `${className} ${className}-${theme}`;
}
