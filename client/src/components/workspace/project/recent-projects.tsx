import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.projects || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader
          className="w-6 h-6 sm:w-8 sm:h-8
         animate-spin
         place-self-center
         flex"
        />
      ) : null}
      {projects?.length === 0 && (
        <div
          className="font-semibold
         text-xs sm:text-sm text-muted-foreground
          text-center py-5"
        >
          No Project created yet
        </div>
      )}

      <ul role="list" className="space-y-2">
        {projects.map((project) => {
          const name = project.createdBy.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);

          return (
            <li
              key={project._id}
              role="listitem"
              className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out"
            >
              <Link
                to={`/workspace/${workspaceId}/project/${project._id}`}
                className="block p-0"
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div className="text-lg sm:text-xl !leading-[1.4rem] shrink-0">
                    {project.emoji}
                  </div>
                  <div className="grid gap-1 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {project.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {project.createdAt
                        ? format(project.createdAt, "PPP")
                        : null}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Created by</span>
                    <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                      <AvatarImage
                        src={project.createdBy.profilePicture || ""}
                        alt="Avatar"
                      />
                      <AvatarFallback className={avatarColor}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProjects;
