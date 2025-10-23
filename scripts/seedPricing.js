require('dotenv').config();
const mongoose = require('mongoose');
const Pricing = require('../models/Pricing');

const pricingPackages = [
  {
    name: "Starter Package",
    description: "Perfect for small businesses and startups looking to establish their online presence.",
    price: 299,
    currency: "USD",
    duration: "one-time",
    image: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      publicId: "skyweb/pricing/starter"
    },
    features: [
      "5 Page Responsive Website",
      "Modern UI/UX Design",
      "Mobile Optimized",
      "Basic SEO Setup",
      "Contact Form Integration",
      "1 Month Free Support"
    ],
    stack: ["React", "Node.js", "MongoDB"],
    category: "web",
    popular: false,
    buttonText: "Get Started",
    order: 1,
    isActive: true
  },
  {
    name: "Professional Plan",
    description: "Comprehensive solution for growing businesses with advanced features and integrations.",
    price: 599,
    currency: "USD",
    duration: "one-time",
    image: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      publicId: "skyweb/pricing/professional"
    },
    features: [
      "10 Page Dynamic Website",
      "Premium UI/UX Design",
      "Full Responsive Design",
      "Advanced SEO Optimization",
      "Admin Dashboard",
      "Database Integration",
      "Email Integration",
      "3 Months Premium Support",
      "Free SSL Certificate"
    ],
    stack: ["MERN Stack", "React", "Express", "MongoDB", "Node.js"],
    category: "full-stack",
    popular: true,
    buttonText: "Most Popular",
    order: 2,
    isActive: true
  },
  {
    name: "Enterprise Solution",
    description: "Complete enterprise-grade solution with custom features tailored to your business needs.",
    price: 1499,
    currency: "USD",
    duration: "one-time",
    image: {
      url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
      publicId: "skyweb/pricing/enterprise"
    },
    features: [
      "Unlimited Pages",
      "Custom Design & Branding",
      "Advanced Features & Integrations",
      "Multi-user Authentication",
      "Role-based Access Control",
      "Payment Gateway Integration",
      "Analytics & Reporting",
      "Cloud Deployment",
      "6 Months Premium Support",
      "Priority Bug Fixes",
      "Free Hosting for 1 Year"
    ],
    stack: ["MERN Stack", "AWS", "Redis", "Docker", "CI/CD"],
    category: "full-stack",
    popular: false,
    buttonText: "Contact Us",
    order: 3,
    isActive: true
  },
  {
    name: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    price: 999,
    currency: "USD",
    duration: "one-time",
    image: {
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      publicId: "skyweb/pricing/mobile"
    },
    features: [
      "iOS & Android Apps",
      "Cross-platform Development",
      "Modern UI/UX Design",
      "Backend API Integration",
      "Push Notifications",
      "Offline Support",
      "App Store Deployment",
      "3 Months Support"
    ],
    stack: ["React Native", "Flutter", "Firebase"],
    category: "mobile",
    popular: false,
    buttonText: "Build App",
    order: 4,
    isActive: true
  },
  {
    name: "E-Commerce Platform",
    description: "Full-featured online store with payment processing and inventory management.",
    price: 1299,
    currency: "USD",
    duration: "one-time",
    image: {
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      publicId: "skyweb/pricing/ecommerce"
    },
    features: [
      "Complete Online Store",
      "Product Catalog Management",
      "Shopping Cart & Checkout",
      "Payment Gateway Integration",
      "Order Management System",
      "Customer Dashboard",
      "Admin Panel",
      "Inventory Management",
      "Email Notifications",
      "Analytics & Reports",
      "6 Months Support"
    ],
    stack: ["MERN Stack", "Stripe", "PayPal", "Razorpay"],
    category: "e-commerce",
    popular: true,
    buttonText: "Start Selling",
    order: 5,
    isActive: true
  },
  {
    name: "Consulting Package",
    description: "Expert technical consulting and code review services for your projects.",
    price: 150,
    currency: "USD",
    duration: "monthly",
    image: {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      publicId: "skyweb/pricing/consulting"
    },
    features: [
      "10 Hours Monthly Consultation",
      "Code Review & Optimization",
      "Architecture Planning",
      "Technology Stack Selection",
      "Performance Optimization",
      "Security Audit",
      "Best Practices Guidance",
      "Priority Email Support"
    ],
    stack: ["Full Stack", "DevOps", "Cloud"],
    category: "consulting",
    popular: false,
    buttonText: "Book Session",
    order: 6,
    isActive: true
  }
];

const seedPricing = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing pricing packages
    await Pricing.deleteMany({});
    console.log('🗑️  Cleared existing pricing packages');

    // Insert new pricing packages
    const createdPackages = await Pricing.insertMany(pricingPackages);
    console.log(`✅ Created ${createdPackages.length} pricing packages`);

    console.log('\n📦 Pricing Packages Created:');
    createdPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - $${pkg.price} ${pkg.popular ? '⭐ POPULAR' : ''}`);
    });

    console.log('\n✅ Pricing packages seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedPricing();

