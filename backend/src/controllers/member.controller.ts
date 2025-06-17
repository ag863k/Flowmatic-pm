import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { joinWorkspaceByInviteService, removeMemberFromWorkspaceService, getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGuard } from "../utils/roleGuard";

export const joinWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
  }
);

export const removeMemberFromWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = z.string().parse(req.params.workspaceId);
    const memberUserId = z.string().parse(req.params.memberUserId);
    const userId = req.user?._id;

    // Check if the user has permission to remove members
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.REMOVE_MEMBER]);

    // Prevent users from removing themselves
    if (userId === memberUserId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "You cannot remove yourself from the workspace",
      });
    }

    const result = await removeMemberFromWorkspaceService(workspaceId, memberUserId);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);
