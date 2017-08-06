interface Navigator {
    storage: StorageManager;
}

interface StorageManager {
    estimate: () => StorageEstimate;
    persist: () => Promise<boolean>;
    persisted: () => Promise<boolean>;
}

interface StorageEstimate {
    quota: number;
    usage: number;
}

if ('serviceWorker' in navigator && 'storage' in navigator) {
    window.addEventListener('load', () => {
        navigator.storage.persist().then(function(granted) {
            if (granted) {
                // Hurrah, your data is here to stay!
                navigator.serviceWorker
                    .register('/sw.js')
                    .then(registration => {
                        // Registration was successful
                        console.log(
                            'ServiceWorker registration successful with scope: ',
                            registration.scope
                        );
                    })
                    .catch(err => {
                        // registration failed :(
                        console.log('ServiceWorker registration failed: ', err);
                    });
            }
        });
    });
}
