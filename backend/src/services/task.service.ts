import mongoose from "mongoose";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }
  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      "Task not found or does not belong to this project"
    );
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      ...body,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updatedTask };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new BadRequestException("Invalid workspace ID");
    }

    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const matchQuery: any = {
      workspace: new mongoose.Types.ObjectId(workspaceId),
    };

    if (filters.projectId && mongoose.Types.ObjectId.isValid(filters.projectId)) {
      matchQuery.project = new mongoose.Types.ObjectId(filters.projectId);
    }

    if (filters.status && filters.status.length > 0) {
      matchQuery.status = { $in: filters.status };
    }

    if (filters.priority && filters.priority.length > 0) {
      matchQuery.priority = { $in: filters.priority };
    }

    if (filters.assignedTo && filters.assignedTo.length > 0) {
      const validAssignedTo = filters.assignedTo.filter(id => 
        mongoose.Types.ObjectId.isValid(id)
      );
      if (validAssignedTo.length > 0) {
        matchQuery.assignedTo = { 
          $in: validAssignedTo.map(id => new mongoose.Types.ObjectId(id)) 
        };
      }
    }

    if (filters.keyword) {
      matchQuery.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.dueDate) {
      matchQuery.dueDate = { $eq: new Date(filters.dueDate) };
    }

    // Use aggregation for robust data handling
    const result = await TaskModel.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                profilePicture: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
          pipeline: [
            {
              $project: {
                _id: 1,
                emoji: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $addFields: {
          assignedTo: {
            $ifNull: [
              { $arrayElemAt: ["$assignedTo", 0] },
              null
            ]
          },
          project: {
            $ifNull: [
              { $arrayElemAt: ["$project", 0] },
              {
                _id: null,
                emoji: "📋",
                name: "Unknown Project"
              }
            ]
          }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          tasks: [
            { $skip: skip },
            { $limit: pageSize }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);

    const tasks = result[0]?.tasks || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      tasks,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip,
      },
    };
  } catch (error) {
    console.error('Error in getAllTasksService:', error);
    // Return empty result instead of throwing
    return {
      tasks: [],
      pagination: {
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
        totalCount: 0,
        totalPages: 0,
        skip: (pagination.pageNumber - 1) * pagination.pageSize,
      },
    };
  }
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  return task;
};

export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  return;
};
