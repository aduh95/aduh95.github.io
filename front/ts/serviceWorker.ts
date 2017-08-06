interface Navigator {
    storage: {
        requestPersistent: () => Promise<boolean>;
    };
}

if ('serviceWorker' in navigator && 'storage' in navigator) {
    window.addEventListener('load', () => {
        navigator.storage.requestPersistent().then(function(granted) {
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
