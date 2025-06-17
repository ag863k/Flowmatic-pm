import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  return (
    <main className="flex flex-1 flex-col py-2 md:py-4 md:pt-3 px-1 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-2 mb-4 md:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate">
            Workspace Overview
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Here&apos;s an overview for this workspace!
          </p>
        </div>
        <Button onClick={onOpen} className="shrink-0 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="sm:inline">New Project</span>
        </Button>
      </div>
      
      <WorkspaceAnalytics />
      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full border rounded-lg p-1 sm:p-2">
          <TabsList className="w-full justify-start border-0 bg-gray-50 px-1 h-10 sm:h-12 overflow-x-auto scrollbar-hide">
            <TabsTrigger className="py-1 sm:py-2 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4" value="projects">
              Recent Projects
            </TabsTrigger>
            <TabsTrigger className="py-1 sm:py-2 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4" value="tasks">
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger className="py-1 sm:py-2 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-2 sm:mt-4">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks" className="mt-2 sm:mt-4">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members" className="mt-2 sm:mt-4">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
