const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://test:1590@cluster0.jjwqaye.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function insertProducts() {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    
    await db.collection('products').deleteMany({});

    const products = require('./products.json');
    
    const collection = db.collection('products');

    for (const product of products) {
        const existingProduct = await collection.findOne({ url: product.url });

        if (!existingProduct) {
            const result = await collection.insertOne(product);
            console.log(`Inserted product with URL: ${product.url}`);
        } else {
            console.log(`Skipped product with URL: ${product.url}`);
        }
    }

    //const result = await collection.insertMany(products);
    //console.log(result);

    await client.close();
}

async function findProductsByBrand(brandName) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');
    const result = await collection.find({ brand: brandName }).toArray();
    
    console.log(`${result.length} products found for brand '${brandName}'`);
    console.log(result);
    
    await client.close();
}

async function findProductsMaximumPrice(maximumPrice) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');
    
    const result = await collection.find({ price: { $lt: maximumPrice } }).toArray();
    
    console.log(`${result.length} products found for maximum price '${maximumPrice}'`);
    console.log(result);
    
    await client.close();
}

async function findProductsSortedByPrice(order) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');
    
    const result = await collection.find().sort({ price: order }).toArray();
    
    console.log(`${result.length} products sorted by price with order '${order}' (1 for ascending or -1 for descending order)`);
    console.log(result);
    
    await client.close();
}

async function findProductsSortedByDate(order) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');

    const result = await collection.find().sort({ date: order }).toArray();

    console.log(`${result.length} products sorted by date with order '${order}' (1 for older first or -1 for most recent first)`);
    console.log(result);

    await client.close();
}

async function findRecentProducts(days = 14) {
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db('clearfashion');

    const collection = db.collection('products');

    const minimumDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString();
    console.log(minimumDate);
    //const result = await collection.find({ date: { $gte: minimumDate } }).toArray();

    let result = await collection.find().toArray();
    result = result.filter(product => {
        const productDate = new Date(product.date).toISOString();
        return productDate >= minimumDate;
    });

    console.log(`${result.length} products with date less than '${days}' days ago`);
    console.log(result);

    await client.close();
}

async function main() {
    await insertProducts();
    findProductsByBrand('Circle Sportswear');
    findProductsMaximumPrice(30);
    findProductsSortedByPrice(1);
    findProductsSortedByPrice(-1);
    findProductsSortedByDate(1);
    findProductsSortedByDate(-1);
    findRecentProducts(2);
}

main();
async function connectToDatabase() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB database:', MONGODB_DB_NAME);

    // Any additional code that needs to interact with the database can be added here

    // Don't forget to close the connection when you're done!
    await client.close();
    console.log('Disconnected from MongoDB database:', MONGODB_DB_NAME);
}

connectToDatabase().catch((error) => console.error(error));

const fs = require('fs');

async function insertProducts(db, products) {
    const collection = db.collection('products');
    const result = await collection.insertMany(products);
    console.log(`${result.insertedCount} products inserted`);
    console.log(result);
}
async function main() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        const data = fs.readFileSync('products.json');
        const products = JSON.parse(data);

        await insertProducts(db, products);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

main();
/*
const brand = 'Montlimart';

async function findProductsByBrand(db, brand) {
    const collection = db.collection('products');
    const products = await collection.find({ brand }).toArray();
    console.log(`Found ${products.length} products for brand '${brand}'`);
    console.log(products);
}

async function query1() {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        await findProductsByBrand(db, brand);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }""""
//}

//query1();*/



