// Initialize home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Load watchlist preview
    loadWatchlistPreview();
    
    // Initialize other home page functionality...
});

function loadWatchlistPreview() {
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('users').doc(user.uid).collection('watchlist')
            .limit(5)
            .get()
            .then(querySnapshot => {
                const container = document.getElementById('watchlist-preview');
                container.innerHTML = '';
                
                if (querySnapshot.empty) {
                    container.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <i class="fas fa-heart-broken text-danger fs-1 mb-3"></i>
                            <p>Your watchlist is empty</p>
                            <a href="#" class="btn btn-danger">Browse Content</a>
                        </div>
                    `;
                    return;
                }
                
                querySnapshot.forEach(doc => {
                    const item = doc.data();
                    container.innerHTML += `
                        <div class="col">
                            <div class="video-card">
                                <img src="${item.poster}" class="card-img-top" alt="${item.title}">
                                <div class="video-preview">
                                    <video muted loop class="w-100">
                                        <source src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-devices.m4v" type="video/mp4">
                                    </video>
                                    <div class="card-actions">
                                        <button class="btn btn-sm btn-danger"><i class="fas fa-play"></i></button>
                                        <button class="btn btn-sm btn-outline-light"><i class="fas fa-info-circle"></i></button>
                                    </div>
                                </div>
                                <div class="card-body p-0 pt-2">
                                    <h5 class="card-title fs-6">${item.title}</h5>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                // Reinitialize hover effects for dynamically loaded content
                if (window.videoHover && window.videoHover.init) {
                    window.videoHover.init();
                }
            })
            .catch(error => {
                console.error("Error loading watchlist:", error);
                document.getElementById('watchlist-preview').innerHTML = `
                    <div class="col-12 text-center py-5 text-danger">
                        <i class="fas fa-exclamation-triangle fs-1 mb-3"></i>
                        <p>Failed to load watchlist</p>
                    </div>
                `;
            });
    }
}

// Add other home page specific functions here