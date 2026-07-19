const fs = require("fs");
const path = require("path");

const PRODUCTS_DIR = path.join(
    __dirname,
    "../src/assets/images/collection"
);

const OUTPUT_FILE = path.join(
    __dirname,
    "../src/assets/data/products.json"
);

// const IMAGE_EXTENSIONS = [".avif", ".webp", ".jpg", ".jpeg", ".png"];
const IMAGE_EXTENSIONS = [".avif"];

//-----------------------------------------
// Product Status Tags
//-----------------------------------------

const STATUS_TAGS = {
    bs: "is-best-seller",
    nw: "is-new-arrival",
    ft: "is-featured-product",
    tr: "is-trending",
    hot: "is-hot-selling",
    gf: "is-gift-product",      // Existing
    gft: "is-gift-product",     // New
    oos: "is-out-of-stock",
    ltd: "is-limited-stock",
    pre: "is-pre-order"
};

//-----------------------------------------
// Collection Tags
//-----------------------------------------

const COLLECTION_TAGS = {
    prm: "Premium",
    lux: "Luxury",
    fest: "Festival Special",
    wed: "Bridal",
    cas: "Casual",
    par: "Party Wear",
    trad: "Traditional",
    eth: "Ethnic",
    mod: "Modern"
};

//-----------------------------------------
// Color Tags
//-----------------------------------------

const COLOR_TAGS = {
    gd: "Gold",
    rg: "Rose Gold",
    sv: "Silver",
    blk: "Black",
    red: "Red",
    grn: "Green",
    blu: "Blue",
    pnk: "Pink"
};

//-----------------------------------------
// Rating Tags
//-----------------------------------------

const RATING_TAGS = {
    "5": 5,
    "45": 4.5,
    "4": 4
};

const products = [];

// Ensure output folder exists
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

// Read all category folders
const categoryFolders = fs
    .readdirSync(PRODUCTS_DIR)
    .filter(folder =>
        fs.statSync(path.join(PRODUCTS_DIR, folder)).isDirectory()
    );

let itemId = 0;

categoryFolders.forEach(category => {

    const categoryPath = path.join(PRODUCTS_DIR, category);

    //-----------------------------------------
    // Read SEO if available
    //-----------------------------------------

    let seoInformation = {};

    const seoFile = path.join(categoryPath, "seo.json");

    if (fs.existsSync(seoFile)) {

        try {

            seoInformation = JSON.parse(
                fs.readFileSync(seoFile, "utf8")
            );

        } catch (err) {

            console.log(`❌ Invalid seo.json in ${category}`);
        }

    } else {
        console.log(`⚠️ seo.json not found for ${category}`);
    }

    //-----------------------------------------
    // Read only image files
    //-----------------------------------------

    const images = fs.readdirSync(categoryPath).filter(file => {

        const ext = path.extname(file).toLowerCase();

        return IMAGE_EXTENSIONS.includes(ext);

    });

    //-----------------------------------------

    images.forEach((image, index) => {

        itemId++;

        const filename = path.basename(image, path.extname(image));

        //-----------------------------------------
        // Price
        //-----------------------------------------

        const priceMatch = filename.match(/-r-(\d+)/i);

        const price = `₹${Number(priceMatch[1])}`;

        //-----------------------------------------
        // Offer
        //-----------------------------------------

        const offerMatch = filename.match(/-ofr-(\d+)/i);

        const offer = offerMatch
            ? `${offerMatch[1]}%`
            : null;

        //-----------------------------------------
        // Product Status
        //-----------------------------------------

        const statusProperties = {};

        Object.entries(STATUS_TAGS).forEach(([tag, property]) => {

            if (filename.includes(`-${tag}`)) {
                statusProperties[property] = true;
            }

        });

        //-----------------------------------------
        // Collection
        //-----------------------------------------

        const collection = Object.entries(COLLECTION_TAGS)
            .find(([tag]) => filename.includes(`-${tag}`))?.[1];

        //-----------------------------------------
        // Color
        //-----------------------------------------

        const color = Object.entries(COLOR_TAGS)
            .find(([tag]) => filename.includes(`-${tag}`))?.[1];

        //-----------------------------------------
        // Rating
        //-----------------------------------------

        const rating = Object.entries(RATING_TAGS)
            .find(([tag]) => filename.includes(`-rt-${tag}`))?.[1];

        //-----------------------------------------
        // Product Object
        //-----------------------------------------

        const product = {

            "product-id": `IMG-${itemId}`,

            "product-code":
                `${category.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,

            "alt": filename.replace(/-/g, " "),

            "category": category,

            "price": price,

            "image":
                `/assets/images/collection/${category}/${image}`,

            ...(offer && {
                "offer": offer
            }),

            ...(collection && {
                "collection": collection
            }),

            ...(color && {
                "color": color
            }),

            ...(rating && {
                "rating": rating
            }),

            ...statusProperties,

            "seo-information": seoInformation

        };

        products.push(product);

    });

});

const output = {

    totalProducts: products.length,

    products

};

fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(output, null, 2),
    "utf8"
);

console.log(`\n✅ Generated ${products.length} products.`);