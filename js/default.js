let oldSlide = 1;
let currentSlide = 1;

/* --- Mobile Menu --- */

const button = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-header');
const navlist = document.getElementById('nav-header-list');

function resizeUpdate() {
	if (document.body.offsetWidth >= 768) {
		nav.setAttribute('aria-expanded', false);
		nav.classList.remove('nav-header-show');
		navlist.classList.remove('nav-header-list-show');
		button.classList.remove('menu-button-close');
	}
}

function toggleMenu() {
	if (nav.getAttribute('aria-expanded') === 'false') {
		nav.setAttribute('aria-expanded', true);
		nav.classList.add('nav-header-show');
		navlist.classList.add('nav-header-list-show');
		button.classList.add('menu-button-close');
		document.body.style.overflow = 'hidden';
	} else {
		nav.setAttribute('aria-expanded', false);
		nav.classList.remove('nav-header-show');
		navlist.classList.remove('nav-header-list-show');
		button.classList.remove('menu-button-close');
		document.body.style.overflow = 'auto';
	}
}

window.addEventListener('resize', resizeUpdate, false);
button.addEventListener('click', toggleMenu, false);

/* Add to Cart */

let cartNumberOfItems = 0;

const inputQuantity = document.querySelector('#input-product-quantity');
const productQuantityMin = parseInt(inputQuantity.getAttribute('min'));
const productQuantityMax = parseInt(inputQuantity.getAttribute('max'));

function subtractQuantity() {
	let productQuantity = parseInt(inputQuantity.value);
	inputQuantity.value = Math.min(Math.max(productQuantity - 1, productQuantityMin), productQuantityMax);
}

function addQuantity() {
	let productQuantity = parseInt(inputQuantity.value);
	inputQuantity.value = Math.min(Math.max(productQuantity + 1, productQuantityMin), productQuantityMax);
}

function addToCart() {
	cartNumberOfItems++;

	// Hide the "Your cart is empty" row
	document.querySelector('#shopping-cart-row-empty').style.display = 'none';
	
	// Product details
	const productName = document.querySelector('#input-product-name').value;
	const productPrice = parseFloat(document.querySelector('#input-product-price').value);
	const productQuantity = parseInt(inputQuantity.value);
	const productTotal = productPrice * productQuantity;

	// Begin constructing new table row with inserted data
	const cartListings = document.querySelector('#shopping-cart-listings');
	
	const cartRow = document.createElement('tr');
	cartRow.id = `cart-item${cartNumberOfItems}`;

	const cartColThumbnail = document.createElement('td');
	cartColThumbnail.className = 'shopping-cart-thumbnail-col';

	const cartColThumbnailImage = document.createElement('img');
	cartColThumbnailImage.className = 'shopping-cart-thumbnail';
	cartColThumbnailImage.src = 'images/image-product-1-thumbnail.jpg';
	cartColThumbnailImage.alt = '';
	cartColThumbnailImage.width = '176';
	cartColThumbnailImage.height = '176';
	cartColThumbnail.appendChild(cartColThumbnailImage);
	cartRow.appendChild(cartColThumbnail);

	const cartColDescription = document.createElement('td');
	cartColDescription.className = 'shopping-cart-description-col';
	cartColDescription.innerHTML =
		`<p>${productName}</p>\r\n` +
		`<p>$${productPrice} x ${productQuantity} <strong class="price-bold">$${productTotal}</strong></p>`;
	cartRow.appendChild(cartColDescription);

	const cartColActions = document.createElement('td');
	cartColActions.className = 'shopping-cart-actions-col';

	const cartDeleteButton = document.createElement('button');
	cartDeleteButton.className = 'delete-item-button';
	cartDeleteButton.setAttribute('data-itemid', cartNumberOfItems)
	cartDeleteButton.innerHTML = '<span class="sr-only">Remove Cart Item</span>';
	cartDeleteButton.addEventListener('click', removeFromCart, false);
	cartColActions.appendChild(cartDeleteButton);
	cartRow.appendChild(cartColActions);

	cartListings.appendChild(cartRow);

	// Show the "items in cart" numeric indicator on the shopping cart icon
	const numberOfItemsIndicator = document.querySelector('.cart-number-of-items');
	numberOfItemsIndicator.innerText = cartNumberOfItems;
	numberOfItemsIndicator.style.display = 'block';
}

function removeFromCart(e) {
	const cartListings = document.querySelector('#shopping-cart-listings');
	const cartItemRow = document.querySelector(`#cart-item${e.target.dataset.itemid}`);
	cartListings.removeChild(cartItemRow);
	cartNumberOfItems--;

	const numberOfItemsIndicator = document.querySelector('.cart-number-of-items');
	numberOfItemsIndicator.innerText = cartNumberOfItems;

	if (cartNumberOfItems === 0) {
		const cartEmptyRow = document.querySelector('#shopping-cart-row-empty');
		cartEmptyRow.style.display = 'table-row';

		// Hide the "items in cart" numeric indicator on the shopping cart icon	
		numberOfItemsIndicator.style.display = 'none';
	}
}

document.querySelector('#product-quantity-button-minus')
	.addEventListener('click', subtractQuantity, false);
document.querySelector('#product-quantity-button-plus')
	.addEventListener('click', addQuantity, false);
document.querySelector('#button-add-cart')
	.addEventListener('click', addToCart, false);
	

/* --- Shopping Cart Popup --- */

const shopCartPopup = document.querySelector('.shopping-cart-popup');

function toggleShopCart() {
	const isShowing = shopCartPopup.getAttribute('class').split(' ').includes('shopping-cart-popup-show');
	if (isShowing) {
		shopCartPopup.classList.remove('shopping-cart-popup-show');
		shopCartPopup.setAttribute('aria-hidden', true);
	} else {
		shopCartPopup.classList.add('shopping-cart-popup-show');
		shopCartPopup.setAttribute('aria-hidden', false);
	}
}

document.querySelector('.shopping-cart-button')
	.addEventListener('click', toggleShopCart, false);

/* --- Slider/Lightbox --- */

const slider = document.querySelector('#slider');
const sliderImagesContainer = document.querySelector('#slider-images');
const sliderThumbnails = slider.querySelectorAll('.thumbnail-button');

const lightbox = document.querySelector('#lightbox');
const lightboxImagesContainer = document.querySelector('#lightbox-images');
const lightboxThumbnails = lightbox.querySelectorAll('.thumbnail-button');

/* --- Mobile Slider --- */

function changeImage(container, images) {
	for (let i = 0; i < images.length; ++i) {
		const imageId = (container === 'slider' ? `slider-image${currentSlide}` : `lightbox-image${currentSlide}`);

		if (images[i].id === imageId) {
			images[i].classList.remove('hidden');
			images[i].setAttribute('aria-hidden', false);
			images[i].setAttribute('tabindex', 0);
		} else {
			images[i].classList.add('hidden');
			images[i].setAttribute('aria-hidden', true);
			images[i].setAttribute('tabindex', -1);
		}
	}
}

function changeThumbnail(container) {
	const targetThumbnails = (container === 'slider' ? sliderThumbnails : lightboxThumbnails);

	const imageId = (container === 'slider' ? `slider-thumbnail${currentSlide}` : `lightbox-thumbnail${currentSlide}`);
	for (let i = 0; i < targetThumbnails.length; ++i) {
		if (targetThumbnails[i].id === imageId) {
			targetThumbnails[i].classList.add('thumbnail-button-active');
		} else {
			targetThumbnails[i].classList.remove('thumbnail-button-active');
		}
	}
}

function sliderPrevious(container) {
	const targetContainer = (container === 'slider' ? sliderImagesContainer : lightboxImagesContainer);
	currentSlide = (currentSlide === 1 ? 4 : currentSlide - 1);
	changeImage(container, targetContainer.children);
	changeThumbnail(container);
}

function sliderNext(container) {
	const targetContainer = (container === 'slider' ? sliderImagesContainer : lightboxImagesContainer);
	currentSlide = (currentSlide === 4 ? 1 : currentSlide + 1);
	changeImage(container, targetContainer.children);
	changeThumbnail(container);
}

function sliderTo(container, slideNumber) {
	currentSlide = slideNumber;
	const targetContainer = (container === 'slider' ? sliderImagesContainer : lightboxImagesContainer);
	changeImage(container, targetContainer.children);
}

document.querySelector('#slider-button-previous')
	.addEventListener('click', () => {
		sliderPrevious('slider');
	}, false);
document.querySelector('#slider-button-next')
	.addEventListener('click', () => {
		sliderNext('slider');
	}, false);

/* --- Tablet/Desktop Slider --- */

function switchImage(e, container) {
	let targetThumbnails = (container === 'slider' ? sliderThumbnails : lightboxThumbnails);

	for (let i = 0; i < targetThumbnails.length; ++i) {
		if (targetThumbnails[i].id === e.currentTarget.id) {
			targetThumbnails[i].classList.add('thumbnail-button-active');
		} else {
			targetThumbnails[i].classList.remove('thumbnail-button-active');
		}
	}

	sliderTo(container, parseInt(e.currentTarget.dataset.slide));
}

for (let i = 0; i < sliderThumbnails.length; ++i) {
	sliderThumbnails[i].addEventListener('click', (e) => {
		switchImage(e, 'slider');
	}, false);
}

/* --- Tablet/Desktop Lightbox --- */

function trapFocus(element) {
	var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
	var firstFocusableEl = focusableEls[0];
	var lastFocusableEl = focusableEls[focusableEls.length - 1];
	var KEYCODE_TAB = 9;

	element.addEventListener('keydown', function (e) {
		var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

		if (!isTabPressed) return;

		if (e.shiftKey) { /* shift + tab */
			if (document.activeElement === firstFocusableEl) {
				lastFocusableEl.focus();
				e.preventDefault();
			}
		} else { /* tab */
			if (document.activeElement === lastFocusableEl) {
				firstFocusableEl.focus();
				e.preventDefault();
			}
		}
	});
}

function toggleLightbox() {
	const isShowing = lightbox.classList.contains('lightbox-overlay-show');
	if (isShowing) {
		lightbox.classList.remove('lightbox-overlay-show');
		lightbox.setAttribute('aria-hidden', true);

		for (let i = 0; i < sliderThumbnails.length; ++i) {
			if (sliderThumbnails[i].id === `slider-thumbnail${currentSlide}`) {
				sliderThumbnails[i].classList.add('thumbnail-button-active');
			} else {
				sliderThumbnails[i].classList.remove('thumbnail-button-active');
			}
		}

		sliderTo('slider', currentSlide);
	} else {
		lightbox.classList.add('lightbox-overlay-show');
		lightbox.setAttribute('aria-hidden', false);
		trapFocus(lightbox);

		for (let i = 0; i < lightboxThumbnails.length; ++i) {
			if (lightboxThumbnails[i].id === `lightbox-thumbnail${currentSlide}`) {
				lightboxThumbnails[i].classList.add('thumbnail-button-active');
			} else {
				lightboxThumbnails[i].classList.remove('thumbnail-button-active');
			}
		}

		sliderTo('lightbox', currentSlide);
	}
}

for (let i = 0; i < sliderImagesContainer.children.length; ++i) {
	sliderImagesContainer.children[i].addEventListener('click', toggleLightbox, false);
}

for (let i = 0; i < lightboxThumbnails.length; ++i) {
	lightboxThumbnails[i].addEventListener('click', (e) => {
		switchImage(e, 'lightbox');
	}, false);
}

document.querySelector('#lightbox-close-button')
	.addEventListener('click', toggleLightbox, false);
document.querySelector('#lightbox-button-previous')
	.addEventListener('click', () => {
		sliderPrevious('lightbox');
	}, false);
document.querySelector('#lightbox-button-next')
	.addEventListener('click', () => {
		sliderNext('lightbox');
	}, false);