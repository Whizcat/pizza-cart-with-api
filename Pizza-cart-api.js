document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {

                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {
                        //console.log(result.data);
                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        // console.log(result.data);
                        this.cartId = result.data.cart_code;
                    });

            },

            pizzaImage(pizza) {
                return `/img/${pizza.size}.png`
            },

            message: '',
            username: '',
            pizzas: [],
            cartId: '',
            cart: {},

            createCart() {
                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },

            add(pizza) {
                //alert(JSON.stringify(pizza))
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "Pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

                    //.get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')

            }

        }
    });
})

