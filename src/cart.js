let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        let { img, name, price } = search;

        return `
        <div class="cart-item">
        <img width="100" src=${search.img} alt=""/>
        <div class="details">
         
        <div class="title-price-x">
        <h4 class ="title-price">
        <p>${search.name}</p>
         <p class='price'>₦${Number(price).toLocaleString()}</p>
        </h4>
        <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
        </div>
         <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
            </div>
            <h3>₦ ${Number(item * price).toLocaleString()}</h3>
</div>
  
        </div>`;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="Homebtn">Back to Home</button>
    </a>
    `;
  }
};

generateCartItems();

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);
  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  localStorage.setItem("data", JSON.stringify(basket));
  update(selectedItem.id);
  generateCartItems();
  TotalAmount();
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);
  if (search === undefined) return;
  else if (search.item === 0) {
    return;
  } else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
  TotalAmount();
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  //console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
  generateCartItems();
  TotalAmount();
  calculation();
  //console.log(selectedItem.id);
};
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    label.innerHTML = `
   <h2>Total Bill:₦${Number(amount).toLocaleString()}</h2>
  <button class="checkout" onclick='handleCheckout(${+amount})'>Checkout</button>
   <button onclick="clearCart()"  class="removeall">Clear Bag</button>`;
  } else return;
};
TotalAmount();

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

const handleCheckout = (amount) => {
  const data = JSON.stringify({
    email: "customer@email.com",
    amount: amount * 100,
  });
  const url = "https://api.paystack.co/transaction/initialize";
  const options = {
    method: "POST",
    body: data,
    headers: {
      Authorization: "Bearer sk_test_e698252eb396895eed88e8d1bf38bd1de303b371",
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      window.open(data.data.authorization_url);
    });
};
