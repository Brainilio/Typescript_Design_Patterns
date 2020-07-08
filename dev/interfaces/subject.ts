interface Subject {
     register(observer: Observer): void
     unregister(observer: Observer): void
     notifyObservers(): void

}