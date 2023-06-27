<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.4.2/dist/alpine.js"></script>

window.addEventListener('DOMContentLoaded', function() {
  var pizzaApp = Alpine.data('pizzaApp', {
    cartItems: [],
    toppings: [
      { id: 1, name: 'Pepperoni' },
      { id: 2, name: 'Mushroom' },
      { id: 3, name: 'Onion' },
      // Add additional toppings as needed
    ],
    selectedSize: 'medium',
    selectedToppings: [],

    addToCart: function() {
      var pizza = {
        id: this.cartItems.length + 1,
        size: this.selectedSize,
        toppings: this.selectedToppings,
        name: this.selectedSize + ' Pizza with ' + this.selectedToppings.join(', ')
      };
      
      this.cartItems.push(pizza);
      this.resetForm();
    },

    resetForm: function() {
      this.selectedSize = 'medium';
      this.selectedToppings = [];
    }
  });
});