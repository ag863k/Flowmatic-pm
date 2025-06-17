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
    await mongoose.connect(config.MONGO_URI);
    await seedRolesIfNeeded();
  } catch (error) {
    throw error;
  }
};

export default connectDatabase;
