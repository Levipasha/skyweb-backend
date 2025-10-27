const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skyweb';

async function migratePricingFeatures() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const pricingCollection = db.collection('pricings');

    console.log('\n📊 Checking pricing packages...');
    const packages = await pricingCollection.find({}).toArray();
    console.log(`Found ${packages.length} pricing packages`);

    let migratedCount = 0;

    for (const pkg of packages) {
      // Check if features need migration
      if (pkg.features && pkg.features.length > 0) {
        const needsMigration = pkg.features.some(f => typeof f === 'string');
        
        if (needsMigration) {
          console.log(`\n🔧 Migrating: ${pkg.name}`);
          
          const migratedFeatures = pkg.features.map(feature => {
            if (typeof feature === 'string') {
              // Old format - convert to new format
              const isNotIncluded = /^[❌✗Xx]\s/.test(feature) || feature.startsWith('❌') || feature.startsWith('✗');
              const cleanText = feature.replace(/^[❌✗Xx]\s*/, '');
              
              const newFeature = {
                text: cleanText,
                included: !isNotIncluded
              };
              
              console.log(`  - "${feature}" → { text: "${cleanText}", included: ${!isNotIncluded} }`);
              return newFeature;
            }
            // Already in new format
            return feature;
          });

          await pricingCollection.updateOne(
            { _id: pkg._id },
            { $set: { features: migratedFeatures } }
          );
          
          migratedCount++;
          console.log(`  ✅ Migrated successfully`);
        } else {
          console.log(`\n✓ Skipping: ${pkg.name} (already in new format)`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Total packages: ${packages.length}`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Already current: ${packages.length - migratedCount}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration
migratePricingFeatures();

