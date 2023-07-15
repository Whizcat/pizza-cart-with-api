document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      name:'',
      hideCart: false,
      cartId: '',
      username: '',
      userHistory: '',
      listOfPizzas: [],
      featuredpizzasList: [],
      cart: { total: 0 },
      message: '',
      Amount: 0,
      makePayment: false,

      init() {
        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then((result) => {
            this.listOfPizzas = result.data.pizzas
          })
          .then(() => {
            this.username = localStorage['username']
            this.cart_id = localStorage['cart_id']
            this.featuredPizzas()
            this.getUserHistory()
            return this.createCart();
          })
      },

      featuredPizzas(){
        return axios
        .get(`https://pizza-api.projectcodex.net/api/pizzas/featured?username=${this.username}`)
          .then((result)=>{
            this.featuredpizzasList = result.data
            console.log(this.featuredpizzasList)
          })
      },

      postfeaturedPizzas(pizza) {
        return axios
          .post('https://pizza-api.projectcodex.net/api/pizzas/featured', {
            "username": this.username,
            "pizza_id": pizza
          })
          .then((result) => {
            console.log(result.data)
          })
          .then(()=>{
            return this.featuredPizzas()
          })
      },

      createCart() {

        if (!this.username) {
          // this.cartId = "Enter Username to create a cart";

          return;
        }

        const username = localStorage['username']
        const cartId = localStorage['cartId'];

        if (cartId && username) {
          this.cartId = cartId;
          this.username = username;
        }
        else {
          return axios
            .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
            .then((result) => {
              this.cartId = result.data.cart_code;
              console.log(this.cartId)
              localStorage['cartId'] = this.cartId;
              localStorage['username'] = this.username;
            });
        }
      },

      // get user's cart history
      getUserHistory() {
        axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
          .then((result) => {
            this.userHistory = result.data;
            console.log(result.data)
          })
      },

      displayCartContent() {
        const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },


      buyPizza(pizza) {
        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
            cart_code: this.cartId,
            pizza_id: pizza.id
          })
          .then(() => {
            this.counter++
            this.message = "Pizza added to the cart"
            this.displayCartContent();
          })

      },


      removePizza(pizza) {

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
            cart_code: this.cartId,
            pizza_id: pizza.id
          })
          .then(() => {
            this.counter--;
            this.message = "Pizza removed from the cart"
            this.displayCartContent();
          })


      },
      payment(pizza) {

        axios
          .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
            cart_code: this.cartId,
          })
          .then(() => {
            if (this.Amount >= this.cart.total) {
              this.message = 'Enjoy your pizza';
              this.change = this.Amount - this.cart.total;
              setTimeout(() => {
                this.name='';
                this.cart.total = 0;
                this.message = '';
                this.cartId = '';
                localStorage['cartId'] = '';
                this.username = localStorage['username'];
                this.createCart();
                window.location.reload();

              }, 5000);

            } else if (this.Amount < this.cart.total) {
              this.message = 'Sorry, That is not enough money!'
              setTimeout(() => {
                this.message = ''
              }, 5000);
            }

          })

      },
      login() {
        if (this.username.length > 2) {
          this.createCart();
          alert("Welcome...");
        }
        else {
          alert("Username too short");
        }
      },
      logout() {
        if (confirm("Sign out..?") == true) {
          this.cart_id = '';
          this.username = '';
          this.name = '';
          localStorage['username'] = '';
          // this.cart_count = 0;
          // this.userCartContent = [];

        } else {
          this.cart_id = localStorage['cart_id'];
          this.username = localStorage['username'];
        }
      }


    }
  })
})