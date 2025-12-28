// JavaScript for the shopping list page
document.addEventListener('DOMContentLoaded', function() {
    initializeShoppingListPage();
});

function initializeShoppingListPage() {
    setupShoppingListActions();
    loadShoppingList();
    updateCartCount();
}

function setupShoppingListActions() {
    // Add custom item
    const addCustomItemBtn = document.getElementById('addCustomItem');
    const saveItemBtn = document.getElementById('saveItem');
    
    if (saveItemBtn) {
        saveItemBtn.addEventListener('click', addCustomItem);
    }

    // Print list
    const printListBtn = document.getElementById('printList');
    if (printListBtn) {
        printListBtn.addEventListener('click', printShoppingList);
    }

    // Clear list
    const clearListBtn = document.getElementById('clearList');
    if (clearListBtn) {
        clearListBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire shopping list?')) {
                clearShoppingList();
            }
        });
    }

    // Mark all complete
    const markAllCompleteBtn = document.getElementById('markAllComplete');
    if (markAllCompleteBtn) {
        markAllCompleteBtn.addEventListener('click', markAllItemsComplete);
    }

    // Add item form submission
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addCustomItem();
        });
    }
}

function loadShoppingList() {
    const container = document.getElementById('shoppingListContent');
    const shoppingList = ShoppingListManager.getShoppingList();

    if (!container) return;

    if (shoppingList.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart3 display-1 text-muted"></i>
                <h4 class="mt-3">Your Shopping List is Empty</h4>
                <p class="text-muted">Add items manually or generate from your meal plan.</p>
                <div class="d-flex gap-2 justify-content-center mt-4">
                    <a href="meal-planner.html" class="btn btn-primary">
                        <i class="bi bi-calendar3 me-1"></i>Plan Meals
                    </a>
                    <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addItemModal">
                        <i class="bi bi-plus-circle me-1"></i>Add Item
                    </button>
                </div>
            </div>
        `;
        updateShoppingSummary();
        return;
    }

    // Group items by category
    const groupedItems = groupItemsByCategory(shoppingList);
    displayGroupedItems(groupedItems, container);
    updateShoppingSummary();
    displayRecipeSources();
}

function groupItemsByCategory(items) {
    const grouped = {};
    
    items.forEach(item => {
        const category = item.category || 'other';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(item);
    });

    return grouped;
}

function displayGroupedItems(groupedItems, container) {
    container.innerHTML = '';

    const categoryOrder = ['produce', 'dairy', 'meat', 'bakery', 'pantry', 'frozen', 'beverages', 'other'];
    
    categoryOrder.forEach(categoryId => {
        if (groupedItems[categoryId]) {
            const categorySection = createCategorySection(categoryId, groupedItems[categoryId]);
            container.appendChild(categorySection);
        }
    });
}

function createCategorySection(categoryId, items) {
    const section = document.createElement('div');
    section.className = 'shopping-category';

    const categoryName = INGREDIENT_CATEGORIES[categoryId] || FormatUtils.capitalize(categoryId);
    const completedCount = items.filter(item => item.completed).length;

    section.innerHTML = `
        <div class="shopping-category-header">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="bi ${getCategoryIcon(categoryId)} me-2"></i>
                    ${categoryName}
                </h6>
                <span class="badge bg-light text-dark">
                    ${completedCount}/${items.length}
                </span>
            </div>
        </div>
        <div class="shopping-items">
            ${items.map(item => createShoppingItemHTML(item)).join('')}
        </div>
    `;

    // Setup item interactions
    setupCategoryActions(section, items);
    
    return section;
}

function createShoppingItemHTML(item) {
    return `
        <div class="shopping-item ${item.completed ? 'completed' : ''}" data-item-id="${item.id}">
            <input type="checkbox" class="shopping-item-checkbox" 
                   ${item.completed ? 'checked' : ''} 
                   data-item-id="${item.id}">
            <div class="shopping-item-content">
                <div>
                    <div class="shopping-item-name">${item.name}</div>
                    ${item.quantity ? `<div class="shopping-item-quantity">${item.quantity}</div>` : ''}
                </div>
                <div class="shopping-item-actions">
                    <button class="btn btn-outline-secondary btn-sm edit-item" data-item-id="${item.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm delete-item" data-item-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupCategoryActions(section, items) {
    // Checkbox actions
    const checkboxes = section.querySelectorAll('.shopping-item-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = parseInt(this.dataset.itemId);
            const completed = this.checked;
            updateItemCompletion(itemId, completed);
        });
    });

    // Edit actions
    const editButtons = section.querySelectorAll('.edit-item');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            editShoppingItem(itemId);
        });
    });

    // Delete actions
    const deleteButtons = section.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.dataset.itemId);
            deleteShoppingItem(itemId);
        });
    });
}

function updateItemCompletion(itemId, completed) {
    const success = ShoppingListManager.updateItem(itemId, { completed });
    
    if (success) {
        // Update UI
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            if (completed) {
                itemElement.classList.add('completed');
            } else {
                itemElement.classList.remove('completed');
            }
        }
        
        updateShoppingSummary();
    }
}

function editShoppingItem(itemId) {
    // For now, just show a simple prompt
    // In a real app, this would open a proper edit modal
    const newName = prompt('Edit item name:');
    if (newName && newName.trim()) {
        const success = ShoppingListManager.updateItem(itemId, { name: newName.trim() });
        if (success) {
            loadShoppingList();
            DOMUtils.showToast('Item updated!', 'success');
        }
    }
}

function deleteShoppingItem(itemId) {
    if (confirm('Delete this item from your shopping list?')) {
        ShoppingListManager.removeItem(itemId);
        loadShoppingList();
        DOMUtils.showToast('Item removed from shopping list', 'success');
    }
}

function addCustomItem() {
    const nameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('itemQuantity');
    const categorySelect = document.getElementById('itemCategory');

    const name = nameInput.value.trim();
    const quantity = quantityInput.value.trim();
    const category = categorySelect.value;

    if (!name) {
        DOMUtils.showToast('Please enter an item name', 'error');
        return;
    }

    const newItem = ShoppingListManager.addItem({
        name,
        quantity,
        category
    });

    if (newItem) {
        // Clear form
        nameInput.value = '';
        quantityInput.value = '';
        categorySelect.value = 'other';

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
        modal.hide();

        // Reload list
        loadShoppingList();
        DOMUtils.showToast('Item added to shopping list!', 'success');
    } else {
        DOMUtils.showToast('Error adding item', 'error');
    }
}

function updateShoppingSummary() {
    const shoppingList = ShoppingListManager.getShoppingList();
    const totalItems = shoppingList.length;
    const checkedItems = shoppingList.filter(item => item.completed).length;
    const remainingItems = totalItems - checkedItems;
    const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    // Update summary elements
    const totalItemsElement = document.getElementById('totalItems');
    const checkedItemsElement = document.getElementById('checkedItems');
    const remainingItemsElement = document.getElementById('remainingItems');
    const progressBarElement = document.getElementById('progressBar');
    const progressTextElement = document.getElementById('progressText');

    if (totalItemsElement) totalItemsElement.textContent = totalItems;
    if (checkedItemsElement) checkedItemsElement.textContent = checkedItems;
    if (remainingItemsElement) remainingItemsElement.textContent = remainingItems;
    
    if (progressBarElement) {
        progressBarElement.style.width = `${progress}%`;
    }
    
    if (progressTextElement) {
        progressTextElement.textContent = `${Math.round(progress)}%`;
    }
}

function displayRecipeSources() {
    const container = document.getElementById('recipeSources');
    const shoppingList = ShoppingListManager.getShoppingList();
    
    if (!container) return;

    // Get unique recipe IDs from shopping list
    const recipeIds = [...new Set(shoppingList
        .filter(item => item.recipeId)
        .map(item => item.recipeId))];

    if (recipeIds.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No recipes selected yet.</p>';
        return;
    }

    container.innerHTML = '';

    recipeIds.forEach(recipeId => {
        const recipe = getRecipeById(recipeId);
        if (recipe) {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'mb-3 pb-2 border-bottom';
            
            recipeElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${recipe.image}" alt="${recipe.name}" 
                         class="rounded me-2" width="40" height="40" style="object-fit: cover;">
                    <div class="flex-grow-1">
                        <div class="fw-bold small">${recipe.name}</div>
                        <div class="text-muted small">${FormatUtils.formatTime(recipe.totalTime)}</div>
                    </div>
                </div>
            `;

            container.appendChild(recipeElement);
        }
    });
}

function markAllItemsComplete() {
    const shoppingList = ShoppingListManager.getShoppingList();
    
    shoppingList.forEach(item => {
        if (!item.completed) {
            ShoppingListManager.updateItem(item.id, { completed: true });
        }
    });

    loadShoppingList();
    DOMUtils.showToast('All items marked as complete!', 'success');
}

function clearShoppingList() {
    ShoppingListManager.clearList();
    loadShoppingList();
    updateCartCount();
    DOMUtils.showToast('Shopping list cleared!', 'success');
}

function printShoppingList() {
    const shoppingList = ShoppingListManager.getShoppingList();
    
    if (shoppingList.length === 0) {
        DOMUtils.showToast('No items to print', 'info');
        return;
    }

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    const groupedItems = groupItemsByCategory(shoppingList);
    
    let printContent = `
        <html>
        <head>
            <title>Shopping List - Recipe Finder</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #ff7043; }
                h3 { color: #4caf50; margin-top: 30px; }
                ul { list-style-type: none; padding: 0; }
                li { margin: 8px 0; padding: 8px; border-bottom: 1px solid #eee; }
                .completed { text-decoration: line-through; color: #999; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <h1>Shopping List</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
    `;

    Object.keys(groupedItems).forEach(categoryId => {
        const categoryName = INGREDIENT_CATEGORIES[categoryId] || FormatUtils.capitalize(categoryId);
        printContent += `<h3>${categoryName}</h3><ul>`;
        
        groupedItems[categoryId].forEach(item => {
            const completedClass = item.completed ? 'completed' : '';
            printContent += `
                <li class="${completedClass}">
                    ☐ ${item.name} ${item.quantity ? `(${item.quantity})` : ''}
                </li>
            `;
        });
        
        printContent += '</ul>';
    });

    printContent += '</body></html>';

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

function getCategoryIcon(category) {
    const icons = {
        'produce': 'bi-apple',
        'dairy': 'bi-egg',
        'meat': 'bi-shop',
        'bakery': 'bi-cake',
        'pantry': 'bi-archive',
        'frozen': 'bi-snow',
        'beverages': 'bi-cup-straw',
        'other': 'bi-bag'
    };
    
    return icons[category] || 'bi-bag';
}

function updateCartCount() {
    const shoppingList = ShoppingListManager.getShoppingList();
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = shoppingList.length;
    });
}