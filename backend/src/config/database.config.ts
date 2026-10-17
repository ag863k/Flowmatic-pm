import mongoose from "mongoose";
import { config } from "./app.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRolesIfNeeded = async () => {
  try {
    const roleCount = await RoleModel.countDocuments();
    
    if (roleCount === 0) {
      for (const roleName in RolePermissions) {
        const role = roleName as keyof typeof RolePermissions;
        const permissions = RolePermissions[role];

        const newRole = new RoleModel({
          name: role,
          permissions: permissions,
        });
        
        await newRole.save();
      }
    }
  } catch (error) {
    throw error;
  }
};

const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB connected successfully');
    
    console.log('Seeding roles if needed...');
    await seedRolesIfNeeded();
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export default connectDatabase;
