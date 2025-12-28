// Utility functions for the Recipe Finder application

// Local Storage utility functions
const StorageUtils = {
    // Get item from localStorage
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from localStorage:', error);
            return null;
        }
    },

    // Set item in localStorage
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item in localStorage:', error);
            return false;
        }
    },

    // Remove item from localStorage
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing item from localStorage:', error);
            return false;
        }
    },

    // Clear all items from localStorage
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Favorites management
const FavoritesManager = {
    getFavorites() {
        return StorageUtils.getItem('favorites') || [];
    },

    addFavorite(recipeId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            StorageUtils.setItem('favorites', favorites);
            this.updateCartCount();
            return true;
        }
        return false;
    },

    removeFavorite(recipeId) {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(recipeId);
        if (index > -1) {
            favorites.splice(index, 1);
            StorageUtils.setItem('favorites', favorites);
            this.updateCartCount();
            return true;
        }
        return false;
    },

    isFavorite(recipeId) {
        const favorites = this.getFavorites();
        return favorites.includes(recipeId);
    },

    toggleFavorite(recipeId) {
        if (this.isFavorite(recipeId)) {
            return this.removeFavorite(recipeId);
        } else {
            return this.addFavorite(recipeId);
        }
    },

    updateCartCount() {
        const favorites = this.getFavorites();
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(element => {
            element.textContent = favorites.length;
        });
    }
};

// Recent recipes management
const RecentManager = {
    getRecent() {
        return StorageUtils.getItem('recent') || [];
    },

    addRecent(recipeId) {
        let recent = this.getRecent();
        // Remove if already exists
        recent = recent.filter(id => id !== recipeId);
        // Add to beginning
        recent.unshift(recipeId);
        // Keep only last 10
        recent = recent.slice(0, 10);
        StorageUtils.setItem('recent', recent);
    },

    clearRecent() {
        StorageUtils.removeItem('recent');
    }
};

// Shopping list management
const ShoppingListManager = {
    getShoppingList() {
        return StorageUtils.getItem('shoppingList') || [];
    },

    addItem(item) {
        const shoppingList = this.getShoppingList();
        const newItem = {
            id: Date.now(),
            name: item.name,
            quantity: item.quantity || '',
            category: item.category || 'other',
            completed: false,
            recipeId: item.recipeId || null
        };
        shoppingList.push(newItem);
        StorageUtils.setItem('shoppingList', shoppingList);
        return newItem;
    },

    updateItem(itemId, updates) {
        const shoppingList = this.getShoppingList();
        const index = shoppingList.findIndex(item => item.id === itemId);
        if (index > -1) {
            shoppingList[index] = { ...shoppingList[index], ...updates };
            StorageUtils.setItem('shoppingList', shoppingList);
            return true;
        }
        return false;
    },

    removeItem(itemId) {
        const shoppingList = this.getShoppingList();
        const filteredList = shoppingList.filter(item => item.id !== itemId);
        StorageUtils.setItem('shoppingList', filteredList);
    },

    clearList() {
        StorageUtils.removeItem('shoppingList');
    },

    addIngredientsFromRecipe(recipeId) {
        const recipe = getRecipeById(recipeId);
        if (!recipe) return false;

        const shoppingList = this.getShoppingList();
        recipe.ingredients.forEach(ingredient => {
            // Check if ingredient already exists
            const exists = shoppingList.some(item => 
                item.name.toLowerCase() === ingredient.toLowerCase()
            );
            
            if (!exists) {
                this.addItem({
                    name: ingredient,
                    category: this.categorizeIngredient(ingredient),
                    recipeId: recipeId
                });
            }
        });
        return true;
    },

    categorizeIngredient(ingredient) {
        const ingredient_lower = ingredient.toLowerCase();
        
        // Produce
        if (ingredient_lower.includes('tomato') || ingredient_lower.includes('onion') || 
            ingredient_lower.includes('garlic') || ingredient_lower.includes('pepper') ||
            ingredient_lower.includes('cucumber') || ingredient_lower.includes('carrot') ||
            ingredient_lower.includes('lettuce') || ingredient_lower.includes('avocado') ||
            ingredient_lower.includes('basil') || ingredient_lower.includes('parsley')) {
            return 'produce';
        }
        
        // Dairy
        if (ingredient_lower.includes('cheese') || ingredient_lower.includes('milk') ||
            ingredient_lower.includes('yogurt') || ingredient_lower.includes('butter') ||
            ingredient_lower.includes('cream') || ingredient_lower.includes('egg')) {
            return 'dairy';
        }
        
        // Meat
        if (ingredient_lower.includes('chicken') || ingredient_lower.includes('beef') ||
            ingredient_lower.includes('pork') || ingredient_lower.includes('fish') ||
            ingredient_lower.includes('salmon') || ingredient_lower.includes('turkey')) {
            return 'meat';
        }
        
        // Pantry
        if (ingredient_lower.includes('flour') || ingredient_lower.includes('sugar') ||
            ingredient_lower.includes('salt') || ingredient_lower.includes('oil') ||
            ingredient_lower.includes('sauce') || ingredient_lower.includes('spice') ||
            ingredient_lower.includes('quinoa') || ingredient_lower.includes('rice')) {
            return 'pantry';
        }
        
        return 'other';
    }
};

// Meal planner management
const MealPlannerManager = {
    getMealPlan() {
        return StorageUtils.getItem('mealPlan') || {};
    },

    addMealToDay(day, meal, recipeId) {
        const mealPlan = this.getMealPlan();
        if (!mealPlan[day]) {
            mealPlan[day] = {};
        }
        mealPlan[day][meal] = recipeId;
        StorageUtils.setItem('mealPlan', mealPlan);
        return true;
    },

    removeMealFromDay(day, meal) {
        const mealPlan = this.getMealPlan();
        if (mealPlan[day] && mealPlan[day][meal]) {
            delete mealPlan[day][meal];
            StorageUtils.setItem('mealPlan', mealPlan);
            return true;
        }
        return false;
    },

    clearMealPlan() {
        StorageUtils.removeItem('mealPlan');
    },

    getAllMealRecipes() {
        const mealPlan = this.getMealPlan();
        const recipeIds = new Set();
        
        Object.values(mealPlan).forEach(day => {
            Object.values(day).forEach(recipeId => {
                if (recipeId) recipeIds.add(recipeId);
            });
        });
        
        return Array.from(recipeIds);
    }
};

// DOM utility functions
const DOMUtils = {
    // Create element with attributes and content
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    },

    // Show loading state
    showLoading(element) {
        element.classList.add('loading');
        element.style.pointerEvents = 'none';
    },

    // Hide loading state
    hideLoading(element) {
        element.classList.remove('loading');
        element.style.pointerEvents = 'auto';
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = this.createElement('div', {
            className: `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`,
            style: 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
        });
        
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    },

    // Smooth scroll to element
    scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

// Format utility functions
const FormatUtils = {
    // Format cooking time
    formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes}min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
        }
    },

    // Format rating stars
    formatRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="bi bi-star-fill"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="bi bi-star-half"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="bi bi-star"></i>';
        }
        
        return starsHTML;
    },

    // Format difficulty badge
    formatDifficulty(difficulty) {
        const colors = {
            'easy': 'success',
            'medium': 'warning',
            'hard': 'danger'
        };
        return `<span class="badge bg-${colors[difficulty]}">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>`;
    },

    // Capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Pluralize word
    pluralize(word, count) {
        return count === 1 ? word : word + 's';
    }
};

// Animation utility functions
const AnimationUtils = {
    // Fade in element
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },

    // Slide up animation
    slideUp(element, duration = 300) {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const translateY = 20 * (1 - progress);
            element.style.transform = `translateY(${translateY}px)`;
            element.style.opacity = progress.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// Initialize utility functions
function initializeUtils() {
    // Update cart count on page load
    FavoritesManager.updateCartCount();
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUtils);