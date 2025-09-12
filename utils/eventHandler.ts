import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";

interface MySubscriptions {
    eventType: string,
    subscription: EmitterSubscription,
}

class EventHandler {
    event: EventEmitter;
    registeredSubscriptions: MySubscriptions[];

    constructor() {
        this.event = new EventEmitter();
        this.registeredSubscriptions = [];
    }

    emitEvent(eventType: string, ...params: any[]) {
        this.event.emit(eventType, params)
    }

    addEventListener(eventType: string, listener: (...args: any[]) => any, context?: any) {
        const subscription = this.event.addListener(eventType, listener, context);
        // Add to stored subscriptions
        this.registeredSubscriptions.push({eventType, subscription});
    }

    removeEventListener(eventType: string) {
        // Search for subscription
        const subscription = this.registeredSubscriptions.find(s => s.eventType == eventType);
        if (subscription !== undefined) {
            // remove subscription
            subscription.subscription.remove();

            // remove item from register list
            this.registeredSubscriptions = this.registeredSubscriptions.filter(s => s.eventType !== eventType);
        }
    }
}

export const eventHandler = new EventHandler();