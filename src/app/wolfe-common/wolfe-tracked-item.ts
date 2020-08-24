export class WolfeTrackedItem {
    id?: number;
    createDate?: Date;
    updateDate?: Date;

    constructor(obj?: any) {
        this.id = obj && obj.id || undefined;
        this.createDate = (obj && obj.createDate) ? new Date(obj.createDate) : undefined;
        this.updateDate = (obj && obj.updateDate) ? new Date(obj.updateDate) : undefined;
    }
}
