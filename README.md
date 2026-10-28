# Thriftora

Thriftora is a responsive, multi-page thrift-fashion storefront for Pakistan, built with plain HTML, CSS and vanilla JavaScript. It works as a static site: open `index.html` directly in a modern browser, or upload the whole folder to static hosting. No build step, backend or package installation is required. Internet access is needed for Google Fonts, GSAP and the remote product photography; the storefront and local cart state otherwise run in the browser.

## Pages

- `index.html` — editorial home, categories, new arrivals, reviews and newsletter confirmation
- `shop.html` — shareable category, size, condition, price, search and sort filters
- `product.html?id=denim-01` — item gallery, measurements, wishlist and add-to-cart
- `cart.html` and `checkout.html` — local cart and WhatsApp Cash on Delivery order flow
- `about.html`, `contact.html`, `policies.html` and `404.html`

## Add or edit products

Edit `window.THRIFTORA_PRODUCTS` in `js/products.js`. Every product has a unique `id`, `name`, `category`, `gender`, `price`, `sizes`, `condition`, `color`, `brand`, `images`, `description`, `measurements`, `isNew`, `isFeatured` and `stock`. `oldPrice` is optional. Product IDs appear in links and browser storage, so keep IDs unique and stable. Use absolute image URLs; if an image fails, the shared image fallback is used.

## Store settings

Edit `js/config.js`:

- Set `whatsapp` to your business WhatsApp number in international digits, without `+` or spaces (for example `923001234567`).
- Change `currency`, `deliveryCharge` and `freeDeliveryThreshold` to update displayed prices and delivery calculations.
- Change the `socials` URLs for your brand profiles.

The contact page includes a matching WhatsApp URL; update its `wa.me` link in `contact.html` when changing the configured WhatsApp number.

## Colors and logo

Edit the CSS custom properties at the top of `css/style.css` to change the paper, ink, accent and soft colors, spacing, radius and shadow. The text logo is shared through `js/components.js`; update the “thriftora” wordmark and `T` mark in that file to change it across the header and footer. The home preloader has a matching wordmark in `index.html`.

## Notes

Cart and wishlist are stored in the browser’s local storage. Checkout validates a Pakistani mobile number, prepares an order summary and opens WhatsApp for the customer to send; it does not collect online payments or submit to a server. The newsletter form is a local confirmation only. Update the policy copy and contact details to match your actual fulfilment and legal practices before launch.
