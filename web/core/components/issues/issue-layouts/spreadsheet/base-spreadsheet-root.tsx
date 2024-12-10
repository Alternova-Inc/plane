import { FC, useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// plane constants
import { ALL_ISSUES } from "@plane/constants";
import { IIssueDisplayFilterOptions } from "@plane/types";
// hooks
import { EIssueFilterType, EIssueLayoutTypes, EIssuesStoreType } from "@/constants/issue";
// hooks
import { useIssues, useUserPermissions } from "@/hooks/store";
import { useIssueStoreType } from "@/hooks/use-issue-layout-store";
import { useIssuesActions } from "@/hooks/use-issues-actions";
import { EUserPermissions, EUserPermissionsLevel } from "@/plane-web/constants/user-permissions";
// views
// stores
// components
import { IssueLayoutHOC } from "../issue-layout-HOC";
// types
// constants
import { IQuickActionProps, TRenderQuickActions } from "../list/list-view-types";
import { SpreadsheetView } from "./spreadsheet-view";

export type SpreadsheetStoreType =
  | EIssuesStoreType.PROJECT
  | EIssuesStoreType.MODULE
  | EIssuesStoreType.CYCLE
  | EIssuesStoreType.PROJECT_VIEW;
interface IBaseSpreadsheetRoot {
  QuickActions: FC<IQuickActionProps>;
  canEditPropertiesBasedOnProject?: (projectId: string) => boolean;
  viewId?: string | undefined;
}

export const BaseSpreadsheetRoot = observer((props: IBaseSpreadsheetRoot) => {
  const { QuickActions, canEditPropertiesBasedOnProject = false, viewId } = props;
  // router
  const { projectId } = useParams();
  // store hooks
  const storeType = useIssueStoreType() as SpreadsheetStoreType;
  const { allowPermissions } = useUserPermissions();
  const { issues, issuesFilter } = useIssues(storeType);
  const {
    fetchIssues,
    fetchNextIssues,
    quickAddIssue,
    updateIssue,
    removeIssue,
    removeIssueFromView,
    archiveIssue,
    restoreIssue,
    updateFilters,
  } = useIssuesActions(storeType);
  // derived values
  const { enableInlineEditing, enableQuickAdd, enableIssueCreation } = issues?.viewFlags || {};
  // user role validation
  const isEditingAllowed = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.PROJECT
  );

  useEffect(() => {
    fetchIssues("init-loader", { canGroup: false, perPageCount: 100 }, viewId);
  }, [fetchIssues, storeType, viewId]);

  const canEditProperties = useCallback(
    (projectId: string | undefined) => {
      const isEditingAllowedBasedOnProject =
        canEditPropertiesBasedOnProject && projectId ? canEditPropertiesBasedOnProject(projectId) : isEditingAllowed;

      return enableInlineEditing && isEditingAllowedBasedOnProject;
    },
    [canEditPropertiesBasedOnProject, enableInlineEditing, isEditingAllowed]
  );

  const issueIds = issues.groupedIssueIds?.[ALL_ISSUES] ?? [];
  const nextPageResults = issues.getPaginationData(ALL_ISSUES, undefined)?.nextPageResults;

  const handleDisplayFiltersUpdate = useCallback(
    (updatedDisplayFilter: Partial<IIssueDisplayFilterOptions>) => {
      if (!projectId) return;

      updateFilters(projectId.toString(), EIssueFilterType.DISPLAY_FILTERS, {
        ...updatedDisplayFilter,
      });
    },
    [projectId, updateFilters]
  );

  const renderQuickActions: TRenderQuickActions = useCallback(
    ({ issue, parentRef, customActionButton, placement, portalElement }) => (
      <QuickActions
        parentRef={parentRef}
        customActionButton={customActionButton}
        issue={issue}
        handleDelete={async () => removeIssue(issue.project_id, issue.id)}
        handleUpdate={async (data) => updateIssue && updateIssue(issue.project_id, issue.id, data)}
        handleRemoveFromView={async () => removeIssueFromView && removeIssueFromView(issue.project_id, issue.id)}
        handleArchive={async () => archiveIssue && archiveIssue(issue.project_id, issue.id)}
        handleRestore={async () => restoreIssue && restoreIssue(issue.project_id, issue.id)}
        portalElement={portalElement}
        readOnly={!isEditingAllowed}
        placements={placement}
      />
    ),
    [isEditingAllowed, removeIssue, updateIssue, removeIssueFromView, archiveIssue, restoreIssue]
  );

  if (!Array.isArray(issueIds)) return null;

  return (
    <IssueLayoutHOC layout={EIssueLayoutTypes.SPREADSHEET}>
      <SpreadsheetView
        displayProperties={issuesFilter.issueFilters?.displayProperties ?? {}}
        displayFilters={issuesFilter.issueFilters?.displayFilters ?? {}}
        handleDisplayFilterUpdate={handleDisplayFiltersUpdate}
        issueIds={issueIds}
        quickActions={renderQuickActions}
        updateIssue={updateIssue}
        canEditProperties={canEditProperties}
        quickAddCallback={quickAddIssue}
        enableQuickCreateIssue={enableQuickAdd}
        disableIssueCreation={!enableIssueCreation || !isEditingAllowed}
        canLoadMoreIssues={!!nextPageResults}
        loadMoreIssues={fetchNextIssues}
      />
    </IssueLayoutHOC>
  );
});
