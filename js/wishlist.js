const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to add city to wishlist
function addToWishlist(city) {
  if (wishlist.includes(city)) {
    alert("You already added this city to your wishlist.");
  } else {
    wishlist.push(city);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${city} has been added to your wishlist!`);
  }
}

// Event listeners for the wishlist buttons
document.querySelectorAll(".add-to-wishlist").forEach((button) => {
  button.addEventListener("click", function () {
    const city = this.getAttribute("data-city");
    addToWishlist(city);
  });
});
