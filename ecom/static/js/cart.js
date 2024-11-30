// Update Cart Buttons
const updateBtns = document.querySelectorAll('.update-cart');

// Add click event listeners to all update buttons
updateBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.product;
        const action = btn.dataset.action;

        console.log(`Product ID: ${productId}, Action: ${action}`);
        console.log(`User: ${user}`);

        // Add animation feedback for button click
        animateButton(btn);

        // Handle cart update based on user authentication
        if (user === 'AnonymousUser') {
            addCookieItem(productId, action);
        } else {
            updateUserOrder(productId, action);
        }
    });
});

// Function to update order for authenticated users
const updateUserOrder = async (productId, action) => {
    console.log('User is authenticated, sending data...');

    const url = '/update_item/';
    const payload = { productId, action };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Order updated successfully:', data);

        // Reload page to reflect changes
        location.reload();
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

// Function to handle cart updates for anonymous users
const addCookieItem = (productId, action) => {
    console.log('User is not authenticated');

    if (action === 'add') {
        cart[productId] = cart[productId] || { quantity: 0 };
        cart[productId].quantity += 1;
    }

    if (action === 'remove') {
        if (cart[productId]) {
            cart[productId].quantity -= 1;

            // Remove item from cart if quantity is zero or less
            if (cart[productId].quantity <= 0) {
                console.log('Item removed from cart');
                delete cart[productId];
            }
        }
    }

    console.log('Updated Cart:', cart);
    document.cookie = `cart=${JSON.stringify(cart)};domain=;path=/`;

    // Reload page to reflect changes
    location.reload();
};

// Function to add animation feedback to buttons
const animateButton = (btn) => {
    btn.style.transition = 'transform 0.2s ease-in-out';
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
};
