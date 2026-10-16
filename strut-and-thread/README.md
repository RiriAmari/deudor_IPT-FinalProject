# Strut & Thread

An e-commerce clothing website built for the **Integrative Programming Technologies** individual final project.

| | |
|---|---|
| **Project title** | Strut & Thread |
| **Student name** | _Your Name Here_ |
| **Section / Block** | _Your Section Here_ |
| **Website category** | E-Commerce |

## Project description

Strut & Thread is a fictional clothing label. Visitors can browse products for women, men, kids and accessories, filter and search the catalogue, add items to a cart, create an account and check out (demo only, no real payments).

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, sidebar navigation, three featured collections, new-in preview |
| Shop All | `shop.html` | Full catalogue; also opened by the home page collections and sidebar links |
| New Arrivals | `new-arrivals.html` | Items flagged as new, newest first |
| Women | `women.html` | Women's products with sizing and care notes |
| Men | `men.html` | Men's products with sizing and care notes |
| Accessories | `accessories.html` | Bags, hats, shoes, belts, eyewear, watches, jewelry, scarves |
| Sales | `sales.html` | Discounted items |
| About Us | `about.html` | Brand story, values, timeline, team, FAQ and a contact form |
| Sign Up / Log In | `signup.html` | Registration, login and account page |

## Main features

- **Search**: header search overlay with live results and saved recent searches
- **Filtering and sorting**: category, division, price slider, sale-only toggle, and five sort options on every product page
- **Cart**: add, change quantity, remove, clear; cart persists between pages and visits
- **Quick view**: product details with required size selection
- **Registration and login**: form validation, password strength meter, show/hide password, passwords hashed with SHA-256 before saving
- **Checkout**: requires a logged-in user and saves the order
- **Currency switch**: Philippine peso or US dollar from the top bar
- **Contact form** and **newsletter form** with validation
- **Responsive layout**: mobile menu, collapsible filters, two-column product grid on phones
- **Accessibility**: keyboard focus styles, ARIA labels, live regions, reduced-motion support

## Technologies used

- HTML5
- CSS3 (custom properties, Grid, Flexbox, media queries)
- JavaScript (ES6+, no frameworks)
- Local Storage for the cart, accounts, orders, searches, messages and currency
- Web Crypto API (SHA-256) for password hashing
- Google Fonts: Playfair Display, Archivo, Archivo Black

## Project structure

```
strut-and-thread/
├── index.html
├── shop.html
├── new-arrivals.html
├── women.html
├── men.html
├── accessories.html
├── sales.html
├── about.html
├── signup.html
├── css/
│   └── styles.css        all styles
├── js/
│   ├── data.js           product catalogue + product illustrations
│   ├── app.js            header, footer, cart, search, currency, toasts
│   ├── shop.js           filters, sorting, product grid, quick view
│   ├── auth.js           sign up, log in, validation
│   ├── home.js           home page sidebar and new-in row
│   └── about.js          contact form validation
└── images/
```