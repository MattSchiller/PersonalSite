declare interface Object {
    differsFrom: (a: any) => boolean;
}

Object.prototype.differsFrom = function(otherObject: any) {
    return areObjectsEqual(this, otherObject);
}

interface IStringKeyed {
    [key: string]: any;
}

function areObjectsEqual(object1: IStringKeyed, object2: IStringKeyed): boolean {
    return !Object.keys(object1).some((key: string) => {
        const objectValue: any = object1[key];

        if (isObject(objectValue) && isObject(object2))
            return !areObjectsEqual(object1, object2);
        else
            return objectValue !== object2[key];
    })
}

function isObject(variable: any): boolean {
    return (typeof variable === "object");
}
