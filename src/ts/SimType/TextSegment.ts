export class TextSegment {
    constructor(
        public text: string = "",
        public className: string = "",
        public link?: string) { }

    public static clone(original: TextSegment): TextSegment {
        return new TextSegment(
            original.text,
            original.className,
            original.link
        );
    }
}
