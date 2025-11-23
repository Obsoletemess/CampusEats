// Data storage using localStorage
class DataStorage {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize data if not exists
        if (!localStorage.getItem('menuItems')) {
            this.initializeSampleData();
        }
        
        // Load and display data
        this.loadMenuItems();
        this.updateDataPreview();
    }
    
    initializeSampleData() {
        const sampleMenuItems = [
            {
                id: 1,
                name: "Creamy Alfredo Pasta",
                price: 180,
                description: "Creamy pasta with parmesan cheese and herbs.",
                category: "lunch",
                votes: 42,
                image: "CreamyAlfredoPasta.png",
                reviews: [
                    { user: "Amit", comment: "Really delicious, but could use more sauce." },
                    { user: "Samar", comment: "My favorite dish in the cafeteria!" }
                ]
            },
            {
                id: 2,
                name: "Classic Cheeseburger",
                price: 220,
                description: "Beef patty with cheese, lettuce, and special sauce.",
                category: "lunch",
                votes: 38,
                image: "ClassicCheeseburger.png",
                reviews: [
                    { user: "Jatin", comment: "Always fresh and tasty." }
                ]
            },
            {
                id: 3,
                name: "Caesar Salad",
                price: 150,
                description: "Fresh romaine lettuce with croutons and Caesar dressing.",
                category: "lunch",
                votes: 25,
                image: "CaesarSalad.png",
                reviews: [
                    { user: "Tushar", comment: "Great healthy option!" }
                ]
            },
            {
                id: 4,
                name: "Margherita Pizza",
                price: 160,
                description: "Classic pizza with tomato, mozzarella, and basil.",
                category: "dinner",
                votes: 51,
                image: "MargheritaPizza.png",
                reviews: [
                    { user: "Gauri", comment: "Perfect lunch option." },
                    { user: "Riya", comment: "Could use more cheese." }
                ]
            },
            {
                id: 5,
                name: "Berry Blast Smoothie",
                price: 120,
                description: "Mixed berries with yogurt and honey.",
                category: "beverages",
                votes: 47,
                image: "BerryBlastSmoothie.png",
                reviews: [
                    { user: "Mitali", comment: "Refreshing and not too sweet." }
                ]
            },
            {
                id: 6,
                name: "Club Sandwich",
                price: 140,
                description: "Triple-decker sandwich with turkey, bacon, and veggies.",
                category: "snacks",
                votes: 29,
                image: "ClubSandwich.png",
                reviews: [
                    { user: "Anuj", comment: "A bit dry, needs more mayo." }
                ]
            }
        ];
        
        localStorage.setItem('menuItems', JSON.stringify(sampleMenuItems));
        localStorage.setItem('suggestions', JSON.stringify([]));
        localStorage.setItem('nextItemId', '7');
    }
    
    getMenuItems() {
        return JSON.parse(localStorage.getItem('menuItems') || '[]');
    }
    
    getSuggestions() {
        return JSON.parse(localStorage.getItem('suggestions') || '[]');
    }
    
    saveMenuItems(items) {
        localStorage.setItem('menuItems', JSON.stringify(items));
    }
    
    saveSuggestions(suggestions) {
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
    }
    
    addSuggestion(suggestion) {
        const suggestions = this.getSuggestions();
        suggestions.push({
            ...suggestion,
            id: Date.now(),
            date: new Date().toISOString()
        });
        this.saveSuggestions(suggestions);
        this.updateDataPreview();
    }
    
    handleImageUpload(file, callback) {
        if (!file || !file.type.match('image.*')) {
            alert('Please select a valid image file.');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('Image size must be less than 2MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    updateMenuItemVotes(itemId, change) {
        const items = this.getMenuItems();
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            items[itemIndex].votes += change;
            this.saveMenuItems(items);
            this.loadMenuItems();
            this.updateDataPreview();
        }
    }
    
    addReview(itemId, user, comment) {
        const items = this.getMenuItems();
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            if (!items[itemIndex].reviews) {
                items[itemIndex].reviews = [];
            }
            
            items[itemIndex].reviews.push({ user, comment });
            this.saveMenuItems(items);
            this.loadMenuItems();
            this.updateDataPreview();
        }
    }
    
    loadMenuItems(category = 'all') {
        const menuGrid = document.getElementById('menu-items');
        const items = this.getMenuItems();
        
        // Filter by category if needed
        const filteredItems = category === 'all' 
            ? items 
            : items.filter(item => item.category === category);
        
        menuGrid.innerHTML = '';
        
        filteredItems.forEach(item => {
            const foodCard = document.createElement('div');
            foodCard.className = 'food-card';
            foodCard.innerHTML = `
                <div class="food-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='">
                </div>
                <div class="food-info">
                    <h3 class="food-name">${item.name}</h3>
                    <p class="food-price">₹${item.price}</p>
                    <p class="food-description">${item.description}</p>
                    
                    <div class="vote-section">
                        <button class="vote-btn upvote" data-id="${item.id}">👍 Keep</button>
                        <span class="vote-count">${item.votes}</span>
                        <button class="vote-btn downvote" data-id="${item.id}">👎 Remove</button>
                    </div>
                    
                    <div class="review-section">
                        <div class="review-form">
                            <textarea class="review-input" placeholder="Add your review..."></textarea>
                            <button class="review-btn" data-id="${item.id}">Submit Review</button>
                        </div>
                        
                        <div class="reviews-list">
                            ${item.reviews ? item.reviews.map(review => 
                                `<div class="review-item">
                                    <strong>${review.user}:</strong> ${review.comment}
                                </div>`
                            ).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
            
            menuGrid.appendChild(foodCard);
        });
        
        // Add event listeners for voting and reviews
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Vote buttons
        document.querySelectorAll('.vote-btn.upvote').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                this.updateMenuItemVotes(itemId, 1);
            });
        });
        
        document.querySelectorAll('.vote-btn.downvote').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                this.updateMenuItemVotes(itemId, -1);
            });
        });
        
        // Review buttons
        document.querySelectorAll('.review-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                const reviewInput = e.target.parentElement.querySelector('.review-input');
                const comment = reviewInput.value.trim();
                
                if (comment) {
                    const user = "Student"; // In a real app, this would come from user authentication
                    this.addReview(itemId, user, comment);
                    reviewInput.value = '';
                } else {
                    alert('Please enter a review before submitting.');
                }
            });
        });
    }
    
    updateDataPreview() {
        const menuItems = this.getMenuItems();
        const suggestions = this.getSuggestions();
        
        // Update menu items preview with images
        const menuPreview = document.getElementById('menu-data-preview');
        menuPreview.innerHTML = menuItems.map(item => 
            `<div class="data-item">
                <div class="data-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                </div>
                <div class="data-item-content">
                    <strong>${item.name}</strong> - ₹${item.price}<br>
                    Votes: ${item.votes} | Reviews: ${item.reviews ? item.reviews.length : 0}
                </div>
            </div>`
        ).join('');
        
        // Update suggestions preview with images
        const suggestionsPreview = document.getElementById('suggestions-data-preview');
        suggestionsPreview.innerHTML = suggestions.length > 0 
            ? suggestions.map(suggestion => 
                `<div class="data-item">
                    ${suggestion.image ? `
                    <div class="data-item-image">
                        <img src="${suggestion.image}" alt="${suggestion.title}" onerror="this.style.display='none'">
                    </div>
                    ` : ''}
                    <div class="data-item-content">
                        <strong>${suggestion.title}</strong> (${suggestion.type})<br>
                        ${suggestion.details.substring(0, 50)}...
                    </div>
                </div>`
            ).join('')
            : '<div class="data-item">No suggestions submitted yet.</div>';
        
        // Update reviews preview with images
        const reviewsPreview = document.getElementById('reviews-data-preview');
        const allReviews = menuItems.flatMap(item => 
            item.reviews ? item.reviews.map(review => ({
                ...review,
                item: item.name,
                itemImage: item.image,
                itemPrice: item.price
            })) : []
        );
        
        reviewsPreview.innerHTML = allReviews.length > 0
            ? allReviews.map(review => 
                `<div class="data-item">
                    <div class="data-item-image">
                        <img src="${review.itemImage}" alt="${review.item}" onerror="this.style.display='none'">
                    </div>
                    <div class="data-item-content">
                        <strong>${review.user}</strong> on ${review.item} (₹${review.itemPrice}):<br>
                        ${review.comment}
                    </div>
                </div>`
            ).join('')
            : '<div class="data-item">No reviews submitted yet.</div>';
    }
    
    exportData() {
        const data = {
            menuItems: this.getMenuItems(),
            suggestions: this.getSuggestions(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'campus-eats-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Convert any decimal prices to whole numbers
                if (data.menuItems) {
                    data.menuItems.forEach(item => {
                        if (typeof item.price === 'number' && item.price % 1 !== 0) {
                            item.price = Math.round(item.price);
                        }
                    });
                    localStorage.setItem('menuItems', JSON.stringify(data.menuItems));
                }
                
                if (data.suggestions) {
                    localStorage.setItem('suggestions', JSON.stringify(data.suggestions));
                }
                
                this.loadMenuItems();
                this.updateDataPreview();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error(error);
            }
        };
        
        reader.readAsText(file);
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('menuItems');
            localStorage.removeItem('suggestions');
            this.initializeSampleData();
            this.loadMenuItems();
            this.updateDataPreview();
            alert('All data has been cleared and reset to sample data.');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const dataStorage = new DataStorage();
    
    // Clear any existing data and reinitialize to ensure proper rupee prices
    localStorage.removeItem('menuItems');
    localStorage.removeItem('suggestions');
    dataStorage.initializeSampleData();
    dataStorage.loadMenuItems();
    dataStorage.updateDataPreview();
    
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            dataStorage.loadMenuItems(category);
        });
    });
    
    // Suggestion form submission
    document.getElementById('submit-suggestion').addEventListener('click', function() {
        const type = document.getElementById('suggestion-type').value;
        const title = document.getElementById('suggestion-title').value.trim();
        const details = document.getElementById('suggestion-details').value.trim();
        const imageFile = document.getElementById('suggestion-image').files[0];
        
        if (!type || !title || !details) {
            alert('Please fill in all required fields.');
            return;
        }
        
        function resetSuggestionForm() {
            document.getElementById('suggestion-type').value = '';
            document.getElementById('suggestion-title').value = '';
            document.getElementById('suggestion-details').value = '';
            document.getElementById('suggestion-image').value = '';
        }
        
        if (imageFile) {
            dataStorage.handleImageUpload(imageFile, function(imageData) {
                dataStorage.addSuggestion({ 
                    type, 
                    title, 
                    details, 
                    image: imageData 
                });
                resetSuggestionForm();
                alert('Thank you for your suggestion with image!');
            });
        } else {
            dataStorage.addSuggestion({ type, title, details });
            resetSuggestionForm();
            alert('Thank you for your suggestion!');
        }
    });
    
    // Data management buttons
    document.getElementById('export-data').addEventListener('click', function() {
        dataStorage.exportData();
    });
    
    document.getElementById('import-data').addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', (e) => dataStorage.importData(e));
        fileInput.click();
    });
    
    document.getElementById('clear-data').addEventListener('click', function() {
        dataStorage.clearAllData();
    });
});