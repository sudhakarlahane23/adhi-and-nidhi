# AdhiAndNidhi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

// Create a JSON bease on availability of product images.
In products folder, there are several category folders like, ad-stud, ad-top, bangles, bugadi etc.
Create a json file for these all folder images with category.
The images have name "ad-stud-r-99-bs-nw-gf-of-img-1" like this.

This image includes name, rate of product, here image name is still -r, best-seller, nw means new arivals, img-1 is product id. as belwo.

name: ad-stud
-r-: r-99
-bs-: Best seller
-nw-: new arival
-gft-: git-product,
-ofr-: offer
-oos-: out of stock
img-1: product id

// is structure of JSON and it should be create getting above image name and make JSON as below.

{
    "product-id": "PROD-001", // get from image-name
    "product-code": "RNG-IMT-01", // get from image-name
    "alt": "Statement Ring", // image-name-with-extantation
    "category": "Rings", // folder name
    "price": 99, // extract from image name
    "image": "/assets/images/products/ad-stud-img-1.avif", // from image folder
    "is-best-seller": false, // extract from image name
    "is-new-arrival": false, // extract from image name
    "seo-information": { // get from image folder. create a json file and take this object from there.
      "meta-title": "Statement Ring with Elegant Finish",
      "meta-description": "Discover our elegant statement ring crafted with a graceful imitation finish. Perfect for weddings and special occasions.",
      "keywords": "statement ring, bridal jewelry, imitation jewelry, elegant ring"
    }
  }


# Product Image Naming Convention

Product information is encoded in the image filename. During the build process, the script reads these values and automatically generates `products.json`.

## Filename Format

```
<category>-r-<price>-<flags>-img-<id>.webp
```

### Example

```
ad-stud-r-799-bs-nw-gl-gd-off-20-rt-5-img-101.webp
```

This represents:

- Category: `ad-stud`
- Price: `₹799`
- Best Seller
- New Arrival
- Gold Plated
- Gold Color
- 20% Discount
- 5-Star Rating
- Product ID: `101`

---

# Available Tags

## Price

| Tag | Description | Example |
|-----|-------------|---------|
| `r-` | Product Price | `r-799` |

## Product Status

| Tag | Description |
|-----|-------------|
| `bs` | Best Seller |
| `nw` | New Arrival |
| `ft` | Featured Product |
| `tr` | Trending |
| `hot` | Hot Selling |
| `gft` | Gift Product |
| `ofr` | On Offer |
| `oos` | Out of Stock |
| `ltd` | Limited Stock |
| `pre` | Pre Order |

## Material

| Tag | Description |
|-----|-------------|
| `gl` | Gold Plated |
| `sl` | Silver Finish |
| `ox` | Oxidized |
| `cz` | Cubic Zirconia |
| `prl` | Pearl |
| `stn` | Stone Work |
| `kdn` | Kundan |
| `plk` | Polki |
| `mnk` | Meenakari |

## Color

| Tag | Description |
|-----|-------------|
| `gd` | Gold |
| `rg` | Rose Gold |
| `sv` | Silver |
| `blk` | Black |
| `red` | Red |
| `grn` | Green |
| `blu` | Blue |
| `pnk` | Pink |

## Collection

| Tag | Description |
|-----|-------------|
| `prm` | Premium |
| `lux` | Luxury |
| `fest` | Festival Special |
| `wed` | Bridal |
| `cas` | Casual |
| `par` | Party Wear |
| `trad` | Traditional |
| `eth` | Ethnic |
| `mod` | Modern |

## Discount

| Tag | Description |
|-----|-------------|
| `off-10` | 10% Discount |
| `off-20` | 20% Discount |
| `off-30` | 30% Discount |

## Rating

| Tag | Description |
|-----|-------------|
| `rt-5` | ★★★★★ |
| `rt-45` | ★★★★☆ |
| `rt-4` | ★★★★ |

## Product ID

| Tag | Description | Example |
|-----|-------------|---------|
| `img-` | Unique Product ID | `img-101` |

---

# Complete Example

```
ad-stud-r-799-bs-nw-gl-gd-prm-off-20-rt-5-img-101.webp
```

This filename means:

- Price: ₹799
- Best Seller
- New Arrival
- Gold Plated
- Gold Color
- Premium Collection
- 20% Discount
- 5-Star Rating
- Product ID: 101

The build script automatically extracts these values and generates the product metadata used by the website.
