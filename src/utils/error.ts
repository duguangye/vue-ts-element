class ElementPlusError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ElementPlusError'
    }
}

export function throwError(scope:string,message:string):never{
    throw new ElementPlusError(`[${scope}] ${message}`)
}
