import { adminDb } from "../src/infrastructure/firebase/admin";
import { sareesFixture } from "../src/model/fixtures/sarees";
import { configFixture } from "../src/model/fixtures/config.fixture";

async function seed() {
  console.log("🌱 Starting Velora Firestore seeding...");

  // Seed Config
  await adminDb.collection("config").doc("singleton").set(configFixture);
  console.log("✓ Config singleton seeded.");

  // Seed Sarees
  const batch = adminDb.batch();
  for (const saree of sareesFixture) {
    const ref = adminDb.collection("sarees").doc(saree.id);
    batch.set(ref, saree);
  }
  await batch.commit();
  console.log(`✓ ${sareesFixture.length} Saree fixtures seeded into Firestore.`);

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
