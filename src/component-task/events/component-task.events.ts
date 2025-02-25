export class AddCoinsForUser {
    constructor(public readonly userId: string, public readonly amount: number) { }
}

export class AddXpForUser {
    constructor(public readonly userId: string, public readonly amount: number) {
    }
}
