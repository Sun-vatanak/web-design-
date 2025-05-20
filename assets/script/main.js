    // Shopping Cart Functionality
    $(document).ready(function() {
        // Initialize cart from localStorage or empty array
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        
        // Update cart counter in header
        function updateCartCounter() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            $('.cart-counter').remove();
            
            if(totalItems > 0) {
                $('#cart-icon').append(`
                    <span class="cart-counter position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        ${totalItems}
                    </span>
                `);
            }
        }
        
        // Update modal cart display
        function updateModalCart() {
            const $cartItems = $('#modal-cart-items');
            const $subtotal = $('#modal-cart-subtotal');
            const $total = $('#modal-cart-total');
            
            $cartItems.empty();
            
            if (cart.length === 0) {
                $cartItems.append('<p class="text-center">Your cart is empty</p>');
                $('#checkout-btn').prop('disabled', true);
            } else {
                let subtotal = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    
                    $cartItems.append(`
                        <div class="cart-item border border-1 border-top p-2 rounded rounded-3 mb-3 d-flex align-items-center" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img me-3 rounded" style="width: 80px; height: 80px;">
                            <div class="flex-grow-1">
                                
                                <div class="d-flex justify-content-between  align-items-center">
                                    
                                    <div class="d">
                                       <h6 class="mb-1 fs-5">${item.name}</h6>
                                       <div class="d-flex align-items-center  border border-1  px-2 mt-2 rounded rounded-3">
                                        <button class="btn btn-sm btn-primary btn-h d-flex justify-content-center align-items-center  minus" >-</button>
                                        <span class="mx-2 fs-5">${item.quantity}</span>
                                        <button class="btn btn-sm btn-h d-flex align-items-center justify-content-center  btn-primary plus">
                                               <i class="bi bi-plus "></i>
                                          </button>
                                        </div>
                                
                                        
                                    </div>
                                    <div class="d-flex  flex-column justify-content-between  ">
        
                                        <button class="btn btn-sm btn-outline-danger ms-2 remove-item ">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                        <span class="fw-bold mt-3">$${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                });
                
                $subtotal.text(subtotal.toFixed(2));
                $total.text(subtotal.toFixed(2));
                $('#checkout-btn').prop('disabled', false);
            }
        }
        
        // Add to cart button click handler
        $(document).on('click', '.add-to-cart', function() {
            const product = $(this).closest('.product-card');
            const id = product.data('id') || Math.floor(Math.random() * 1000);
            const name = product.data('name') || product.find('.card-title').text();
            const price = parseFloat(product.data('price')) || 
                        parseFloat(product.find('.text-primary').text().replace('$', '').trim());
            const image = product.data('image') || product.find('img').attr('src');
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            // Show add to cart animation
            const button = $(this);
            button.html('<i class="bi bi-check-lg"></i> ADDED');
            setTimeout(() => {
                button.html('ADD TO CART <i class="bi bi-cart-fill"></i>');
            }, 1000);
            
            updateCartCounter();
            saveCartToLocalStorage();
            
            // Show brief notification
            showToast('Item added to cart!');
        });
        
        // Save cart to localStorage
        function saveCartToLocalStorage() {
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        }
        $('#checkout-btn').click(function() {
        // Save current cart as an order before redirecting
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
            date: new Date().toISOString(),
            items: [...cart],
            total: parseFloat($('#cart-total').text())
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Redirect to checkout page
        window.location.href = '../Shop/checkout.html';
    });
        // Handle quantity changes in modal
        $('#modal-cart-items').on('click', '.minus', function() {
            const $cartItem = $(this).closest('.cart-item');
            const id = $cartItem.data('id');
            const item = cart.find(item => item.id === id);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
                updateModalCart();
                updateCartCounter();
                saveCartToLocalStorage();
            }
        });
        
        $('#modal-cart-items').on('click', '.plus', function() {
            const $cartItem = $(this).closest('.cart-item');
            const id = $cartItem.data('id');
            const item = cart.find(item => item.id === id);
            
            item.quantity += 1;
            updateModalCart();
            updateCartCounter();
            saveCartToLocalStorage();
        });
        
        // Handle item removal in modal
        $('#modal-cart-items').on('click', '.remove-item', function() {
            const $cartItem = $(this).closest('.cart-item');
            const id = $cartItem.data('id');
            
            cart = cart.filter(item => item.id !== id);
            updateModalCart();
            updateCartCounter();
            saveCartToLocalStorage();
            
            showToast('Item removed from cart');
        });
        
     
        
        // Cart icon click handler
        $('#cart-icon').click(function(e) {
            e.preventDefault();
            updateModalCart();
            cartModal.show();
        });
        
        // Initialize cart counter on page load
        updateCartCounter();
        
        // Toast notification function
        function showToast(message) {
            const toast = $(`
                    <div class="position-fixed bottom-0 border-0 end-0 p-3" style="z-index: 11">
                    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true " class="text-light border-0 overflow-hidden">
                        <div class="toast-body border-0  overflow-hidden text-light rounded rounded-3 bg-primary d-flex justify-content-between align-items-center">
                            ${message}
                            <button type="button" class="btn-close text-light " data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            `);
            
            $('body').append(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    });