export class BusyEvent {
    constructor(
        public busyOrFinished: BusyOrFinished,
        public activityId: number
    ) {}
}

export enum BusyOrFinished {
    BUSY,
    FINISHED
}
