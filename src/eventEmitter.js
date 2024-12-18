export class EventEmitter {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.state));
    }
}
