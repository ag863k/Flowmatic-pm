import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAllTasksQueryFn } from "@/lib/api";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformStatusEnum,
} from "@/lib/helper";
import { TaskType } from "@/types/api.type";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const RecentTasks = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
      }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = data?.tasks || [];

  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      {isLoading ? (
        <Loader
          className="w-6 h-6 sm:w-8 sm:h-8
        animate-spin
        place-self-center flex
        "
        />
      ) : null}

      {tasks?.length === 0 && (
        <div
          className="font-semibold
         text-xs sm:text-sm text-muted-foreground
          text-center py-5"
        >
          No Task created yet
        </div>
      )}

      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map((task) => {
          const name = task?.assignedTo?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={task._id}
              className="p-2 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
            >
              {/* Task Info */}
              <div className="flex flex-col space-y-1 flex-grow min-w-0">
                <span className="text-xs sm:text-sm capitalize text-gray-600 font-medium">
                  {task.taskCode}
                </span>
                <p className="text-sm sm:text-md font-semibold text-gray-800 truncate">
                  {task.title}
                </p>
                <span className="text-xs sm:text-sm text-gray-500">
                  Due: {task.dueDate ? format(task.dueDate, "PPP") : null}
                </span>
              </div>

              {/* Mobile: Badges and Assignee in row */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* Task Status & Priority */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge
                    variant={TaskStatusEnum[task.status]}
                    className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0 text-xs"
                  >
                    <span>{transformStatusEnum(task.status)}</span>
                  </Badge>
                  <Badge
                    variant={TaskPriorityEnum[task.priority]}
                    className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0 text-xs"
                  >
                    <span>{transformStatusEnum(task.priority)}</span>
                  </Badge>
                </div>

                {/* Assignee */}
                <div className="flex items-center space-x-2 shrink-0">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage
                      src={task.assignedTo?.profilePicture || ""}
                      alt={task.assignedTo?.name}
                    />
                    <AvatarFallback className={avatarColor}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentTasks;
