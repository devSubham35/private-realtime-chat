export class ApiError extends Error {
    status: number;

    constructor(message: string, status = 400, name?: string) {
        super(message);
        this.status = status;

        if(name){
            this.name = name;
        }
    }
}
