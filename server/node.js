const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://test:1590@cluster0.jjwqaye.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

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
        const data = fs.readFileSync('products_montlimart.json');
        const products = JSON.parse(data);

        await insertProducts(db, products);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

main();

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
    }
}

query1();