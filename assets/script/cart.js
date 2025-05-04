$(document).ready(function() {
    let cart = [];
    
    // Add to cart button click handler
    $('.add-to-cart').click(function() {
        const product = $(this).closest('.product');
        const id = product.data('id');
        const image = product.data('image');
        const name = product.data('name');
        const price = parseFloat(product.data('price'));
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                image: image,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
    });
    
    // Update the cart display
    function updateCart() {
        const $cartItems = $('#cart-items');
        const $cartTotal = $('#cart-total');
        const $emptyCartMessage = $('.empty-cart-message');
        const $checkoutBtn = $('#checkout-btn');
        
        // Clear the cart display
        $cartItems.find('.cart-item').remove();
        
        if (cart.length === 0) {
            $emptyCartMessage.show();
            $checkoutBtn.hide();
        } else {
            $emptyCartMessage.hide();
            $checkoutBtn.show();
            
            // Add each item to the cart display
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                $cartItems.append(`
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image rounded rounded-3">
                            <span>${item.name}</span>
                        </div>
                        <div>
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <span class="item-total">$${itemTotal.toFixed(2)}</span>
                            <span class="remove-item"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                `);
            });
            
            $cartTotal.text(total.toFixed(2));
        }
    }
    
    // Handle quantity changes and item removal
    $('#cart-items').on('click', '.minus', function() {
        const $cartItem = $(this).closest('.cart-item');
        const id = $cartItem.data('id');
        const item = cart.find(item => item.id === id);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
        }
    });
    
    $('#cart-items').on('click', '.plus', function() {
        const $cartItem = $(this).closest('.cart-item');
        const id = $cartItem.data('id');
        const item = cart.find(item => item.id === id);
        
        item.quantity += 1;
        updateCart();
    });
    
    $('#cart-items').on('click', '.remove-item', function() {
        const $cartItem = $(this).closest('.cart-item');
        const id = $cartItem.data('id');
        
        cart = cart.filter(item => item.id !== id);
        updateCart();
    });
    
    // Checkout button handler
    $('#checkout-btn').click(function() {
        alert(`Order placed! Total: $${$('#cart-total').text()}`);
        cart = [];
        updateCart();
    });
});