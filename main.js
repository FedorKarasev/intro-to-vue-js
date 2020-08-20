let eventBus = new Vue();

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true,
        }
    },
    template: `
        <div>
            <span 
            v-for="(tab, index) in tabs"
            :class="{ activeTab: selectedTab === tab }"
            class="tab"
            :key="index"
            @click="selectedTab = tab">{{ tab }}</span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews:</h2>
                <p v-if="!reviews.length">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>Name: {{ review.name }}</p>
                        <p>Review: {{ review.review }}</p>
                        <p>Rating: {{ review.rating }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a review'"></product-review>

        </div>

        
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a review'],
            selectedTab: 'Reviews',
        }
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>

    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating && this.review) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
    
                eventBus.$emit('review-submitted', productReview);
    
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if (!this.name) this.errors.push('Name required');
                if (!this.review) this.errors.push('Review required');
                if (!this.rating) this.errors.push('Rating required');
            }
        }
    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img v-bind:src="image" alt="">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In stock</p>
                <p v-else="inStock">Out of stock</p>
                <p>Shipping is: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
                </div>

                <button @click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}">Add to cart</button>

                <product-tabs :reviews="reviews"></product-tabs>
                

            </div>
        </div>
    `,
    data() {
        return {
            product: 'Socks',
            selectedVariant: 0,
            brand: 'Vue Mastery',
            details: ['80% cotton', '20% polyester', 'Gender-neytral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0,
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            } else {
                return 2.99;
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push('productReview');
        })
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
});