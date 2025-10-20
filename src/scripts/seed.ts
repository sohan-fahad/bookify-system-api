import { connectDB, disconnectDB } from '../configs/db.config.js';
import Book from '../modules/book/book.model.js';
import books from '../data/books.js';

const seedBooks = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        await connectDB();
        console.log('✅ Connected to database');

        const existingBooks = await Book.find({});
        if (existingBooks.length > 0) {
            return;
        }

        // const deleteResult = await Book.deleteMany({});
        // console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing books`);

        const insertedBooks = await Book.insertMany(books);
        console.log(`✅ Seeded ${insertedBooks.length} books successfully!`);

        console.log('\n📚 Sample books:');
        insertedBooks.slice(0, 3).forEach((book) => {
            console.log(`  - ${book.title} by ${book.author} (${book.year}) - ${book.price} credits`);
        });

        await disconnectDB();
        console.log('\n✅ Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await disconnectDB();
        process.exit(1);
    }
};

seedBooks();