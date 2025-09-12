function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counterEl = document.getElementById('cart-counter');
    if (!counterEl) return;

    if (cart.length > 0) {
        counterEl.textContent = `В корзине товаров: ${cart.length}`;
    } else {
        counterEl.textContent = '';
    }
}

// Добавление товара в корзину
function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавлен в корзину!`);
    updateCartCounter();
}

// Отображение корзины
function displayCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста.</p>';
        updateCartCounter();
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Цена: ${item.price}₽</p>
            <button onclick="removeItem(${index})">Удалить</button>
        `;
        container.appendChild(div);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'product';
    totalDiv.innerHTML = `<h3>Итого: ${total}₽</h3>`;
    container.appendChild(totalDiv);

    updateCartCounter();
}

// Удаление товара из корзины
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCounter();
    }
}

// Открыть модальное окно оформления заказа
function openOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'flex';
}

// Закрыть модальное окно
function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'none';
}

// Отправка заказа через EmailJS
function sendOrder(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.user_name.value.trim();
    const contact = form.user_contact.value.trim();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Ваша корзина пуста!");
        closeOrderForm();
        return;
    }

    const orderDetails = cart.map(item => `${item.name} - ${item.price}₽`).join('\n');

    const templateParams = {
        user_name: name,
        user_contact: contact,
        order_list: orderDetails
    };

    emailjs.send('service_r20w9qh', 'template_6p1etam', templateParams)
        .then(function(response) {
            alert("Заказ успешно отправлен!");
            localStorage.removeItem('cart');
            closeOrderForm();
            displayCart();
            updateCartCounter();
            form.reset();
        }, function(error) {
            alert("Ошибка отправки: " + JSON.stringify(error));
        });
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCounter();

    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', sendOrder);
    }
});
