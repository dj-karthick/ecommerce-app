const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'MacBook Pro 16" M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'The ultimate pro laptop with the incredibly powerful M3 Max chip. Features a stunning Liquid Retina XDR display and all-day battery life.',
    category: 'Laptops',
    price: 349900,
    stock: 12,
    isFeatured: true,
  },
  {
    name: 'Sony WH-1000XM5 Noise Cancelling',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Industry-leading noise cancellation. Two processors control 8 microphones for unprecedented noise cancellation.',
    category: 'Audio',
    price: 29990,
    stock: 25,
    isFeatured: true,
  },
  {
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and 5x optical zoom.',
    category: 'Smartphones',
    price: 159900,
    stock: 8,
    isFeatured: true,
  },
  {
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'A 75% layout (84-key) RGB backlight Bluetooth wireless mechanical keyboard. Connects with up to 3 devices.',
    category: 'Accessories',
    price: 8999,
    stock: 30,
    isFeatured: false,
  },
  {
    name: 'Logitech MX Master 3S',
    image: 'https://images.unsplash.com/photo-1615663245857-ac9310038ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks.',
    category: 'Accessories',
    price: 9495,
    stock: 15,
    isFeatured: false,
  },
  {
    name: 'Samsung 49" Odyssey G9 Gaming Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: '1000R curved screen technology matches the contours of the human eye for unimaginable realism. 240Hz RapidCurve.',
    category: 'Monitors',
    price: 135000,
    stock: 3,
    isFeatured: true,
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected for Seeding');
    
    // Clear existing products
    await Product.deleteMany();
    console.log('🧹 Cleared existing products');

    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log('🎉 Successfully seeded 6 premium sample products!');

    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
