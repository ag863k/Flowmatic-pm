import mongoose from "mongoose";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import UserModel from "../models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new BadRequestException("Invalid user ID or workspace ID");
    }

    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const member = await MemberModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    })
      .populate({
        path: "role",
        select: "name _id"
      })
      .lean()
      .exec();

    if (!member) {
      throw new UnauthorizedException(
        "You are not a member of this workspace",
        ErrorCodeEnum.ACCESS_UNAUTHORIZED
      );
    }

    const roleName = member.role?.name || Roles.MEMBER;
    
    return { role: roleName };
  } catch (error) {
    console.error('Error in getMemberRoleInWorkspace:', error);
    // Instead of throwing, return a default role to prevent crashes
    if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
      throw error;
    }
    // For other errors, return member role to be safe
    return { role: Roles.MEMBER };
  }
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find workspace by invite code
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found");
  }

  // Check if user is already a member
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  // Add user to workspace as a member
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};

export const removeMemberFromWorkspaceService = async (
  workspaceId: string,
  memberUserId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId: memberUserId,
    workspaceId: workspaceId,
  }).populate("role");

  if (!member) {
    throw new NotFoundException("Member not found in this workspace");
  }

  // Prevent removing the workspace owner
  if (member.role?.name === Roles.OWNER) {
    throw new BadRequestException("Cannot remove the workspace owner");
  }

  // Remove the member
  await MemberModel.deleteOne({
    userId: memberUserId,
    workspaceId: workspaceId,
  });

  // Update user's current workspace if they were using this workspace
  const user = await UserModel.findById(memberUserId);
  if (user && user.currentWorkspace?.toString() === workspaceId) {
    // Find another workspace the user is a member of
    const otherMembership = await MemberModel.findOne({
      userId: memberUserId,
    });

    user.currentWorkspace = otherMembership ? otherMembership.workspaceId : null;
    await user.save();
  }

  return { message: "Member removed successfully" };
};
