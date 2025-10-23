require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/Team');
const Project = require('../models/Project');

// Hardcoded team data from Team.js
const teamMembers = [
  {
    name: "MD Rabbani",
    role: "Founder & Backend Developer",
    bio: "Founder and visionary leader with extensive experience in backend development, system architecture, and business strategy. Passionate about building scalable solutions and leading high-performance teams to transform digital experiences.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/me.jpg", // Replace with actual Cloudinary URL after upload
      publicId: "skyweb/team/me"
    },
    skills: ["Leadership", "Full-Stack Development", "System Architecture", "Strategic Planning", "Team Management"],
    social: {
      email: "ceo@skyweb.com",
      linkedin: "https://linkedin.com/in/mohammad-rabbani-pasha-08272b23a",
      github: "#"
    },
    order: 1,
    isActive: true
  },
  {
    name: "nimmalapudi vikhyath",
    role: "UI and UX &chief financialofficer",
    bio: "Creative UI/UX designer with strong financial acumen, combining artistic vision with business strategy. Expert in user experience design and financial planning to drive both creative excellence and business growth.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/nvc.jpg",
      publicId: "skyweb/team/nvc"
    },
    skills: ["UI/UX Design", "Financial Planning", "Business Strategy", "Creative Design"],
    social: {
      email: "cfo@skyweb.com",
      linkedin: "https://www.linkedin.com/feed/",
      twitter: "#"
    },
    order: 2,
    isActive: true
  },
  {
    name: "T.vamshi",
    role: "frontend developer & CEO",
    bio: "Dynamic frontend developer and strategic CEO with a passion for creating exceptional user experiences. Leads technical innovation while driving business growth through modern web technologies and client-focused solutions.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/v.jpg",
      publicId: "skyweb/team/v"
    },
    skills: ["Frontend Development", "Leadership", "Strategic Planning", "React", "JavaScript"],
    social: {
      email: "mike@skyweb.com",
      linkedin: "https://www.linkedin.com/in/vamshi-chinna-2863b41a5",
      behance: "#"
    },
    order: 3,
    isActive: true
  },
  {
    name: "Muskaan fathima",
    role: "Project Manager & Frontend Developer",
    bio: "Experienced project manager and skilled frontend developer ensuring seamless delivery, client satisfaction, and exceptional user interfaces. Combines technical expertise with strong leadership skills.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/m.jpg",
      publicId: "skyweb/team/m"
    },
    skills: ["Project Management", "Frontend Development", "React", "JavaScript", "Team Leadership"],
    social: {
      email: "emily@skyweb.com",
      linkedin: "#"
    },
    order: 4,
    isActive: true
  },
  {
    name: "Chowla Manikya kalyan",
    role: "ML engineer",
    bio: "Machine Learning Engineer specializing in AI model development, data analysis, and intelligent system implementation. Expert in building scalable ML solutions that drive business innovation and automation.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/k.jpg",
      publicId: "skyweb/team/k"
    },
    skills: ["Machine Learning", "Python", "TensorFlow", "Data Analysis", "AI Models"],
    social: {
      email: "alex@skyweb.com",
      linkedin: "https://www.linkedin.com/in/manikyakalyan/",
      github: "https://github.com/Leoprincy"
    },
    order: 5,
    isActive: true
  },
  {
    name: "Arpan Varma",
    role: "Python Developer",
    bio: "Expert Python developer specializing in backend systems and AI integration. Skilled in Python stack technologies and prompt engineering for intelligent applications.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/arpan.jpg",
      publicId: "skyweb/team/arpan"
    },
    skills: ["Python", "Django", "FastAPI", "Machine Learning", "Prompt Engineering"],
    social: {
      email: "arpan@skyweb.com",
      linkedin: "https://www.linkedin.com/in/arpan-varma/",
      github: "#"
    },
    order: 6,
    isActive: true
  },
  {
    name: "Arun manjala",
    role: "client manager",
    bio: "As a Client Manager at SkyWeb, I ensure seamless communication between clients and our development team. My focus is on understanding business needs, crafting clear project strategies, and delivering exceptional digital experiences on time. I believe in long-term relationships built on transparency, collaboration, and success.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/arun.jpg",
      publicId: "skyweb/team/arun"
    },
    skills: ["Excel", "data visualization"],
    social: {
      email: "alex@skyweb.com"
    },
    order: 7,
    isActive: true
  },
  {
    name: "Abhi",
    role: "project manager",
    bio: "As a Project Manager at SkyWeb, I ensure seamless communication between clients and our development team. My focus is on understanding business needs, crafting clear project strategies, and delivering exceptional digital experiences on time. I believe in long-term relationships built on transparency, collaboration, and success.",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/abhi.jpg",
      publicId: "skyweb/team/abhi"
    },
    skills: ["Excel", "data visualization", "problem sloving", "team management", "communication"],
    social: {
      email: "alex@skyweb.com"
    },
    order: 8,
    isActive: true
  },
  {
    name: "Mahek fatima",
    role: "backend & servermanger",
    bio: "React Full-Stack Manager and performance enthusiast. I specialize in building and scaling complex, data-intensive web applications using the React ecosystem, with a keen focus on the server and deployment layer. My expertise centers on full-stack JavaScript, Next.js architecture, robust API integration, and leveraging DevOps principles to ensure fast, stable, and highly available production environments. I bridge the gap between front-end user experience and backend engineering stability",
    image: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/skyweb/team/mm.jpg",
      publicId: "skyweb/team/mm"
    },
    skills: ["Management", "Operations", "ArchitectureSkills", "react fully-stack"],
    social: {
      email: "alex@skyweb.com"
    },
    order: 9,
    isActive: true
  }
];

// Hardcoded project data from Projects.js
const projects = [
  // Completed Projects
  {
    title: "Retrend Online",
    description: "A comprehensive online buy & sell marketplace platform with real-time listings, secure payments, and user authentication.",
    image: {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      publicId: "skyweb/projects/retrend"
    },
    projectUrl: "https://www.retrendonline.in",
    status: "completed",
    category: "e-commerce",
    tags: ["MERN Stack", "E-Commerce", "Real-time"],
    order: 1,
    isActive: true
  },
  {
    title: "Inventory Management System",
    description: "Smart inventory tracking software for factories with automated stock alerts, reporting, and analytics dashboard.",
    image: {
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      publicId: "skyweb/projects/inventory"
    },
    projectUrl: "https://frontend-sunny-12.vercel.app/",
    status: "completed",
    category: "dashboard",
    tags: ["React", "Node.js", "Dashboard"],
    order: 2,
    isActive: true
  },
  {
    title: "Fusion Wear E-Commerce",
    description: "Modern fashion e-commerce platform featuring ethnic and fusion wear with seamless shopping experience, cart management, and secure checkout.",
    image: {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      publicId: "skyweb/projects/fusion"
    },
    projectUrl: "https://thefusionwears.com/lander",
    status: "completed",
    category: "e-commerce",
    tags: ["E-Commerce", "MERN Stack", "Payment Gateway"],
    order: 3,
    isActive: true
  },
  // Ongoing Projects
  {
    title: "Lovable Communication Chat App",
    description: "Real-time messaging application with instant notifications, group chats, media sharing, and end-to-end encryption for secure conversations.",
    image: {
      url: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80",
      publicId: "skyweb/projects/chat"
    },
    projectUrl: "#",
    status: "ongoing",
    category: "app",
    tags: ["React", "Socket.io", "Real-time", "Ongoing"],
    order: 4,
    isActive: true
  },
  {
    title: "Eaten Food App",
    description: "Food delivery and restaurant discovery app with real-time order tracking, menu browsing, and seamless payment integration.",
    image: {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      publicId: "skyweb/projects/eaten"
    },
    projectUrl: "#",
    status: "ongoing",
    category: "app",
    tags: ["React Native", "Food Delivery", "Ongoing"],
    order: 5,
    isActive: true
  },
  {
    title: "UC Kiddies School Management",
    description: "Comprehensive school management system with student records, attendance tracking, parent portal, and mobile app for seamless communication.",
    image: {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      publicId: "skyweb/projects/school"
    },
    projectUrl: "#",
    status: "ongoing",
    category: "website",
    tags: ["Website + App", "MERN Stack", "Ongoing"],
    order: 6,
    isActive: true
  }
];

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment this out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing data...');
    await Team.deleteMany({});
    await Project.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert team members
    console.log('\n👥 Migrating team members...');
    const teamResult = await Team.insertMany(teamMembers);
    console.log(`✅ ${teamResult.length} team members migrated successfully!`);

    // Insert projects
    console.log('\n📁 Migrating projects...');
    const projectResult = await Project.insertMany(projects);
    console.log(`✅ ${projectResult.length} projects migrated successfully!`);

    console.log('\n🎉 Data migration completed successfully!');
    console.log('==================================');
    console.log(`Total Team Members: ${teamResult.length}`);
    console.log(`Total Projects: ${projectResult.length}`);
    console.log('==================================');
    console.log('\n⚠️  NOTE: The image URLs are placeholder Cloudinary URLs.');
    console.log('   Please upload actual images through the admin panel to replace them.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateData();

