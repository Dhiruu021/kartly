import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { initialCategories, initialProducts, initialCoupons } from "./seedData.js";

export const seedDatabase = async (): Promise<void> => {
  console.log("Starting database seeding process...");

  // Remove old demo accounts if present
  await User.deleteMany({ email: { $in: ["admin@kartly.store", "customer@kartly.store"] } });

  // 1. Categories
  for (const cat of initialCategories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }
  console.log(`Seeded ${initialCategories.length} categories.`);

  // 2. Products
  for (const prod of initialProducts) {
    await Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true, new: true });
  }
  console.log(`Seeded ${initialProducts.length} products.`);

  // 3. Official Owner & Administrator Account
  const ownerEmail = "owner@kartly.in";
  const existingOwner = await User.findOne({ email: ownerEmail });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Kartly123", salt);

  if (!existingOwner) {
    await User.create({
      name: "Kartly Owner",
      email: ownerEmail,
      password: hashedPassword,
      role: "admin",
      addresses: [
        {
          fullName: "Kartly Store Headquarter",
          phone: "+91 98765 43210",
          street: "Connaught Place, Central Wing",
          apartment: "Suite 502",
          city: "New Delhi",
          state: "Delhi",
          postalCode: "110001",
          country: "India",
          isDefault: true,
        },
      ],
    });
    console.log(`Created Store Owner & Admin user: ${ownerEmail}`);
  } else {
    existingOwner.password = hashedPassword;
    existingOwner.role = "admin";
    await existingOwner.save();
    console.log(`Updated credentials for Store Owner: ${ownerEmail}`);
  }

  // 4. Coupons
  for (const coupon of initialCoupons) {
    await Coupon.findOneAndUpdate({ code: coupon.code }, coupon, { upsert: true, new: true });
  }
  console.log(`Seeded ${initialCoupons.length} coupons.`);

  // 5. Sample Initial Orders for Dashboard Analytics
  const ownerUser = await User.findOne({ email: ownerEmail });
  const orderCount = await Order.countDocuments();
  if (orderCount === 0 && ownerUser) {
    await Order.create([
      {
        orderNumber: "KRT-89211",
        customer: ownerUser._id,
        customerName: "Aarav Sharma",
        customerPhone: "+91 98230 11223",
        items: [
          {
            productId: "seed-item-1",
            name: "Bolle Lounge Chair",
            slug: "bolle-lounge-chair",
            price: 8900,
            finishName: "Oat bouclé",
            finishColor: "#e9e3d7",
            quantity: 1,
            image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
          },
        ],
        subtotal: 8900,
        discount: 0,
        shippingFee: 0,
        total: 8900,
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "card",
        shippingAddress: {
          fullName: "Aarav Sharma",
          street: "Bandra West, Hill Road",
          apartment: "Flat 12B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400050",
          country: "India",
        },
        trackingNumber: "TRK-984210",
      },
      {
        orderNumber: "KRT-90142",
        customer: ownerUser._id,
        customerName: "Priya Patel",
        customerPhone: "+91 99112 33445",
        items: [
          {
            productId: "seed-item-2",
            name: "Linne Table Lamp",
            slug: "linne-table-lamp",
            price: 1890,
            finishName: "Natural linen",
            finishColor: "#efe6d6",
            quantity: 2,
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
          },
        ],
        subtotal: 3780,
        discount: 378,
        couponCode: "KARTLY10",
        shippingFee: 0,
        total: 3402,
        status: "packing",
        paymentStatus: "paid",
        paymentMethod: "upi",
        shippingAddress: {
          fullName: "Priya Patel",
          street: "Koramangala 4th Block",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560034",
          country: "India",
        },
      },
    ]);
    console.log("Seeded sample completed and in-flight orders for dashboard analytics.");
  }

  console.log("Database seeding completed successfully!");
};

// If run directly from terminal
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
