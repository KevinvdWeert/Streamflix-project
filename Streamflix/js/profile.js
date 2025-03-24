// Initialize Firestore
const db = firebase.firestore();

// DOM Elements
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileAvatar = document.getElementById('profile-avatar');
const watchlistContainer = document.getElementById('watchlist');
const signoutBtn = document.getElementById('signout-btn');

// Check auth state
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Load profile data
        profileName.textContent = user.displayName || 'User';
        profileEmail.textContent = user.email;
        
        if (user.photoURL) {
            profileAvatar.src = user.photoURL;
        }
        
        // Load watchlist
        loadWatchlist(user.uid);
    } else {
        window.location.href = 'index.html';
    }
});

// Sign out
signoutBtn.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => window.location.href = 'index.html');
});

// Load watchlist from Firestore
function loadWatchlist(userId) {
    db.collection('users').doc(userId).collection('watchlist')
        .get()
        .then(querySnapshot => {
            watchlistContainer.innerHTML = '';
            
            if (querySnapshot.empty) {
                watchlistContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-heart-broken text-danger fs-1 mb-3"></i>
                        <p>Your watchlist is empty</p>
                        <a href="home.html" class="btn btn-danger">Browse Content</a>
                    </div>
                `;
                return;
            }
            
            querySnapshot.forEach(doc => {
                const item = doc.data();
                watchlistContainer.innerHTML += `
                    <div class="col">
                        <div class="video-card">
                            <img src="${item.poster}" class="card-img-top" alt="${item.title}">
                            <div class="card-body p-0 pt-2">
                                <h5 class="card-title fs-6">${item.title}</h5>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading watchlist: ", error);
            watchlistContainer.innerHTML = `
                <div class="col-12 text-center py-5 text-danger">
                    <i class="fas fa-exclamation-triangle fs-1 mb-3"></i>
                    <p>Failed to load watchlist</p>
                </div>
            `;
        });
}

// Handle profile updates
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const avatarFile = document.getElementById('avatarUpload').files[0];
    const displayName = document.getElementById('displayName').value;
    
    try {
        // Update display name
        if (displayName) {
            await user.updateProfile({ displayName });
            profileName.textContent = displayName;
        }
        
        // Update profile picture if selected
        if (avatarFile) {
            const storageRef = firebase.storage().ref(`profile_pictures/${user.uid}`);
            const uploadTask = storageRef.put(avatarFile);
            
            uploadTask.on('state_changed', 
                null, 
                (error) => console.error("Upload failed:", error),
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    await user.updateProfile({ photoURL: downloadURL });
                    profileAvatar.src = downloadURL;
                }
            );
        }
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
});