/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

// Let Workbox take control
self.skipWaiting()
clientsClaim()

// Listen for Push Events from the backend
self.addEventListener('push', (event) => {
    if (!event.data) return

    let data = { title: 'New Notification', message: 'You have a new message', url: '/' }

    try {
        const payload = event.data.json()
        data = { ...data, ...payload }
    } catch (err) {
        console.error('Error parsing push data', err)
    }

    const options: NotificationOptions = {
        body: data.message,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: {
            url: data.url
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    )
})

// Handle Notification Click (open url)
self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const url = event.notification.data?.url || '/'

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus()
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(url)
            }
        })
    )
})
