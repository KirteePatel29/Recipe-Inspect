// JavaScript for the submit recipe page
document.addEventListener('DOMContentLoaded', function() {
    initializeSubmitRecipePage();
});

function initializeSubmitRecipePage() {
    setupFormActions();
    updateCartCount();
}

function setupFormActions() {
    // Add ingredient button
    const addIngredientBtn = document.getElementById('addIngredient');
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', addIngredientRow);
    }

    // Add instruction button
    const addInstructionBtn = document.getElementById('addInstruction');
    if (addInstructionBtn) {
        addInstructionBtn.addEventListener('click', addInstructionRow);
    }

    // Image preview
    const recipeImageInput = document.getElementById('recipeImage');
    if (recipeImageInput) {
        recipeImageInput.addEventListener('change', handleImagePreview);
    }

    // Form submission
    const recipeForm = document.getElementById('recipeForm');
    if (recipeForm) {
        recipeForm.addEventListener('submit', handleFormSubmission);
    }

    // Preview button
    const previewBtn = document.getElementById('previewRecipe');
    if (previewBtn) {
        previewBtn.addEventListener('click', previewRecipe);
    }

    // Setup initial remove buttons
    setupRemoveButtons();
}

function addIngredientRow() {
    const container = document.getElementById('ingredientsList');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row mb-2';
    
    newRow.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control" placeholder="e.g., 2 cups flour" required>
            <button class="btn btn-outline-danger remove-ingredient" type="button">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    container.appendChild(newRow);
    setupRemoveButtons();
    
    // Focus on the new input
    newRow.querySelector('input').focus();
}

function addInstructionRow() {
    const container = document.getElementById('instructionsList');
    const stepNumber = container.children.length + 1;
    
    const newRow = document.createElement('div');
    newRow.className = 'instruction-row mb-3';
    
    newRow.innerHTML = `
        <div class="d-flex">
            <span class="badge bg-primary me-3 mt-1">${stepNumber}</span>
            <div class="flex-grow-1">
                <textarea class="form-control" rows="2" 
                          placeholder="Describe this step in detail..." required></textarea>
            </div>
            <button class="btn btn-outline-danger btn-sm ms-2 remove-instruction" type="button">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    container.appendChild(newRow);
    setupRemoveButtons();
    updateInstructionNumbers();
    
    // Focus on the new textarea
    newRow.querySelector('textarea').focus();
}

function setupRemoveButtons() {
    // Remove ingredient buttons
    const removeIngredientBtns = document.querySelectorAll('.remove-ingredient');
    removeIngredientBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const ingredientRows = document.querySelectorAll('.ingredient-row');
            if (ingredientRows.length > 1) {
                this.closest('.ingredient-row').remove();
            } else {
                DOMUtils.showToast('At least one ingredient is required', 'error');
            }
        });
    });

    // Remove instruction buttons
    const removeInstructionBtns = document.querySelectorAll('.remove-instruction');
    removeInstructionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const instructionRows = document.querySelectorAll('.instruction-row');
            if (instructionRows.length > 1) {
                this.closest('.instruction-row').remove();
                updateInstructionNumbers();
            } else {
                DOMUtils.showToast('At least one instruction is required', 'error');
            }
        });
    });
}

function updateInstructionNumbers() {
    const instructionRows = document.querySelectorAll('.instruction-row');
    instructionRows.forEach((row, index) => {
        const badge = row.querySelector('.badge');
        if (badge) {
            badge.textContent = index + 1;
        }
    });
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('imagePreview');
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <div class="mt-3">
                    <img src="${e.target.result}" alt="Recipe preview" 
                         class="img-fluid rounded shadow-sm" style="max-height: 200px;">
                    <button type="button" class="btn btn-outline-danger btn-sm mt-2" 
                            onclick="removeImagePreview()">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.innerHTML = '';
    }
}

function removeImagePreview() {
    document.getElementById('recipeImage').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    // Simulate form submission
    DOMUtils.showLoading(document.getElementById('recipeForm'));
    
    setTimeout(() => {
        DOMUtils.hideLoading(document.getElementById('recipeForm'));
        
        // In a real app, this would send to a server
        console.log('Recipe submitted:', formData);
        
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Reset form
        document.getElementById('recipeForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Reset dynamic fields
        resetDynamicFields();
        
    }, 2000);
}

function collectFormData() {
    const form = document.getElementById('recipeForm');
    const formData = new FormData(form);
    
    // Basic information
    const recipeData = {
        name: document.getElementById('recipeName').value.trim(),
        category: document.getElementById('recipeCategory').value,
        cuisine: document.getElementById('recipeCuisine').value,
        prepTime: parseInt(document.getElementById('prepTime').value) || 0,
        cookTime: parseInt(document.getElementById('cookTime').value) || 0,
        servings: parseInt(document.getElementById('servings').value) || 1,
        difficulty: document.getElementById('difficulty').value,
        description: document.getElementById('recipeDescription').value.trim(),
        notes: document.getElementById('recipeNotes').value.trim(),
        ingredients: [],
        instructions: [],
        dietary: []
    };

    // Calculate total time
    recipeData.totalTime = recipeData.prepTime + recipeData.cookTime;

    // Collect ingredients
    const ingredientInputs = document.querySelectorAll('#ingredientsList input');
    ingredientInputs.forEach(input => {
        const ingredient = input.value.trim();
        if (ingredient) {
            recipeData.ingredients.push(ingredient);
        }
    });

    // Collect instructions
    const instructionTextareas = document.querySelectorAll('#instructionsList textarea');
    instructionTextareas.forEach(textarea => {
        const instruction = textarea.value.trim();
        if (instruction) {
            recipeData.instructions.push(instruction);
        }
    });

    // Collect dietary tags
    const dietaryCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    dietaryCheckboxes.forEach(checkbox => {
        recipeData.dietary.push(checkbox.value);
    });

    // Handle image
    const imageFile = document.getElementById('recipeImage').files[0];
    if (imageFile) {
        recipeData.imageFile = imageFile;
    }

    return recipeData;
}

function validateFormData(data) {
    // Required fields validation
    if (!data.name) {
        DOMUtils.showToast('Recipe name is required', 'error');
        return false;
    }

    if (!data.category) {
        DOMUtils.show Toast('Please select a category', 'error');
        return false;
    }

    if (!data.description) {
        DOMUtils.showToast('Recipe description is required', 'error');
        return false;
    }

    if (data.ingredients.length === 0) {
        DOMUtils.showToast('At least one ingredient is required', 'error');
        return false;
    }

    if (data.instructions.length === 0) {
        DOMUtils.showToast('At least one instruction is required', 'error');
        return false;
    }

    // Validate times
    if (data.prepTime < 0 || data.cookTime < 0) {
        DOMUtils.showToast('Times cannot be negative', 'error');
        return false;
    }

    if (data.servings < 1) {
        DOMUtils.showToast('Servings must be at least 1', 'error');
        return false;
    }

    return true;
}

function previewRecipe() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }

    // Create preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'modal fade';
    previewModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Recipe Preview</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${generatePreviewHTML(formData)}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="submitFromPreview()">Submit Recipe</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(previewModal);
    const modal = new bootstrap.Modal(previewModal);
    modal.show();

    // Remove modal from DOM when hidden
    previewModal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(previewModal);
    });
}

function generatePreviewHTML(data) {
    return `
        <div class="recipe-preview">
            <h3>${data.name}</h3>
            <p class="text-muted">${data.description}</p>
            
            <div class="row mb-4">
                <div class="col-3 text-center">
                    <strong>${data.prepTime}min</strong><br>
                    <small class="text-muted">Prep</small>
                </div>
                <div class="col-3 text-center">
                    <strong>${data.cookTime}min</strong><br>
                    <small class="text-muted">Cook</small>
                </div>
                <div class="col-3 text-center">
                    <strong>${data.servings}</strong><br>
                    <small class="text-muted">Servings</small>
                </div>
                <div class="col-3 text-center">
                    <strong>${FormatUtils.capitalize(data.difficulty)}</strong><br>
                    <small class="text-muted">Difficulty</small>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <h5>Ingredients</h5>
                    <ul>
                        ${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
                <div class="col-md-6">
                    <h5>Instructions</h5>
                    <ol>
                        ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                </div>
            </div>

            ${data.dietary.length > 0 ? `
                <div class="mt-3">
                    <h6>Dietary Information</h6>
                    ${data.dietary.map(diet => `<span class="badge bg-success me-1">${FormatUtils.capitalize(diet)}</span>`).join('')}
                </div>
            ` : ''}

            ${data.notes ? `
                <div class="mt-3">
                    <h6>Additional Notes</h6>
                    <p>${data.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function submitFromPreview() {
    // Close preview modal
    const previewModal = document.querySelector('.modal.show');
    if (previewModal) {
        const modal = bootstrap.Modal.getInstance(previewModal);
        modal.hide();
    }

    // Submit the form
    document.getElementById('recipeForm').dispatchEvent(new Event('submit'));
}

function resetDynamicFields() {
    // Reset ingredients to one row
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = `
        <div class="ingredient-row mb-2">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="e.g., 2 cups flour" required>
                <button class="btn btn-outline-danger remove-ingredient" type="button">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    // Reset instructions to one row
    const instructionsList = document.getElementById('instructionsList');
    instructionsList.innerHTML = `
        <div class="instruction-row mb-3">
            <div class="d-flex">
                <span class="badge bg-primary me-3 mt-1">1</span>
                <div class="flex-grow-1">
                    <textarea class="form-control" rows="2" 
                              placeholder="Describe this step in detail..." required></textarea>
                </div>
                <button class="btn btn-outline-danger btn-sm ms-2 remove-instruction" type="button">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;

    // Re-setup remove buttons
    setupRemoveButtons();
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}

// Make functions global for onclick handlers
window.removeImagePreview = removeImagePreview;
window.submitFromPreview = submitFromPreview;