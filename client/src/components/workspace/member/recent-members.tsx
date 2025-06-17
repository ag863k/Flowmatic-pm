import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { Loader } from "lucide-react";

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader
          className="w-8 h-8 
        animate-spin
        place-self-center flex"
        />
      ) : null}

      <ul role="list" className="space-y-3">
        {members.map((member, index) => {
          const name = member?.userId?.name || "";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <li
              key={index}
              role="listitem"
              className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage
                    src={member.userId.profilePicture || ""}
                    alt="Avatar"
                  />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Member Details */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {member.userId.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{member.role.name}</p>
              </div>

              {/* Joined Date */}
              <div className="ml-auto text-xs sm:text-sm text-gray-500 text-right hidden sm:block">
                <p>Joined</p>
                <p>{member.joinedAt ? format(member.joinedAt, "PPP") : null}</p>
              </div>
              
              {/* Mobile: Show just the role name */}
              <div className="ml-auto text-xs text-gray-500 sm:hidden">
                <p>{member.role.name}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentMembers;
