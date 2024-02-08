import { FC } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

// ui
import { Breadcrumbs, LayersIcon } from "@plane/ui";
// helper
import { renderEmoji } from "helpers/emoji.helper";
// services
import { IssueService } from "services/issue";
// constants
import { ISSUE_DETAILS } from "constants/fetch-keys";
import { useMobxStore } from "lib/mobx/store-provider";
import { ChevronLeft } from "lucide-react";

// services
const issueService = new IssueService();

export const ProjectIssueDetailsHeader: FC = observer(() => {
  const router = useRouter();
  const { workspaceSlug, projectId, issueId } = router.query;

  const { project: projectStore } = useMobxStore();

  const { currentProjectDetails } = projectStore;

  const { data: issueDetails } = useSWR(
    workspaceSlug && projectId && issueId ? ISSUE_DETAILS(issueId as string) : null,
    workspaceSlug && projectId && issueId
      ? () => issueService.retrieve(workspaceSlug as string, projectId as string, issueId as string)
      : null
  );

  const goBack = () => {
    router.back();
  }

  return (
    <div className="relative z-10 flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
      <div className="flex w-full flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
        <div className="flex items-stretch">
          <button onClick={goBack} aria-label="go back" className="p-2">
            <ChevronLeft className="text-[#525252]"/>
          </button>
          <Breadcrumbs>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              icon={
                currentProjectDetails?.emoji ? (
                  renderEmoji(currentProjectDetails.emoji)
                ) : currentProjectDetails?.icon_prop ? (
                  renderEmoji(currentProjectDetails.icon_prop)
                ) : (
                  <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded bg-gray-700 uppercase text-white">
                    {currentProjectDetails?.name.charAt(0)}
                  </span>
                )
              }
              label={currentProjectDetails?.name ?? "Project"}
              link={`/${workspaceSlug}/projects`}
            />

            <Breadcrumbs.BreadcrumbItem
              type="text"
              icon={<LayersIcon className="h-4 w-4 text-custom-text-300" />}
              label="Issues"
              link={`/${workspaceSlug}/projects/${projectId}/issues`}
            />

            <Breadcrumbs.BreadcrumbItem
              type="text"
              label={`${issueDetails?.project_detail.identifier}-${issueDetails?.sequence_id}` ?? "..."}
            />
          </Breadcrumbs>
        </div>
      </div>
    </div>
  );
});
