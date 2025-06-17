import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      // Create a new user if it doesn't exist
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });

      // Create a new workspace for the new user
      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    } else {
      // User exists, check if they have an account for this provider
      const existingAccount = await AccountModel.findOne({
        userId: user._id,
        provider: provider,
      }).session(session);

      if (!existingAccount) {
        // Add new provider account for existing user
        const account = new AccountModel({
          userId: user._id,
          provider: provider,
          providerId: providerId,
        });
        await account.save({ session });
      }

      // Ensure user has a current workspace
      if (!user.currentWorkspace) {
        const userMember = await MemberModel.findOne({ userId: user._id }).session(session);
        if (userMember) {
          user.currentWorkspace = userMember.workspaceId;
          await user.save({ session });
        }
      }
    }

    await session.commitTransaction();

    return { user };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Create a new user
    const user = new UserModel({
      email,
      name,
      password, // This will be hashed by the model's pre-save hook
    });
    await user.save({ session });

    // Create account record for email/password login
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email, // Use email as providerId for email accounts
    });
    await account.save({ session });

    // Create a new workspace for the new user
    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    // Get the owner role
    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    // Create member record
    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
    });
    await member.save({ session });

    // Set current workspace
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  // Ensure user has a current workspace set
  if (!user.currentWorkspace) {
    const userMember = await MemberModel.findOne({ userId: user._id });
    if (userMember) {
      user.currentWorkspace = userMember.workspaceId;
      await user.save();
    }
  }

  return user.omitPassword();
};
