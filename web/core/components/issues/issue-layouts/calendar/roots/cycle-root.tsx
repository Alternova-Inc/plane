import { useCallback } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
//hooks
import { CycleIssueQuickActions } from "@/components/issues";
import { EIssuesStoreType } from "@/constants/issue";
import { useIssues } from "@/hooks/store";
// components
import { BaseCalendarRoot } from "../base-calendar-root";
// types
// constants

export const CycleCalendarLayout: React.FC = observer(() => {
  const { workspaceSlug, projectId, cycleId } = useParams();

  const { issues } = useIssues(EIssuesStoreType.CYCLE);

  if (!cycleId) return null;

  const addIssuesToView = useCallback(
    (issueIds: string[]) => {
      if (!workspaceSlug || !projectId || !cycleId) throw new Error();
      return issues.addIssueToCycle(workspaceSlug.toString(), projectId.toString(), cycleId.toString(), issueIds);
    },
    [issues?.addIssueToCycle, workspaceSlug, projectId, cycleId]
  );

  return (
    <BaseCalendarRoot
      QuickActions={CycleIssueQuickActions}
      addIssuesToView={addIssuesToView}
      viewId={cycleId?.toString()}
    />
  );
});
