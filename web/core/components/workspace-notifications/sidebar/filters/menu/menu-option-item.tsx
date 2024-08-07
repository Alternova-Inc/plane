"use client";

import { FC } from "react";
import { observer } from "mobx-react";
import { Check } from "lucide-react";
// constants
import { ENotificationFilterType } from "@/constants/notification";
// helpers
import { cn } from "@/helpers/common.helper";
// hooks
import { useWorkspaceNotifications } from "@/hooks/store";

export const NotificationFilterOptionItem: FC<{ label: string; value: ENotificationFilterType }> = observer((props) => {
  const { value, label } = props;
  // hooks
  const { filters, updateFilters } = useWorkspaceNotifications();

  const handleFilterTypeChange = (filterType: ENotificationFilterType, filterValue: boolean) =>
    updateFilters("type", {
      ...filters.type,
      [filterType]: filterValue,
    });

  // derived values
  const isSelected = filters?.type?.[value] || false;

  return (
    <div
      key={value}
      className="flex items-center gap-2 cursor-pointer px-2 p-1 transition-all hover:bg-custom-background-80 rounded-sm"
      onClick={() => handleFilterTypeChange(value, !isSelected)}
    >
      <div
        className={cn(
          "flex-shrink-0 w-3 h-3 flex justify-center items-center rounded-sm transition-all",
          isSelected ? "bg-custom-primary-100" : "bg-custom-background-90"
        )}
      >
        {isSelected && <Check className="h-2 w-2" />}
      </div>
      <div className={cn("whitespace-nowrap text-sm", isSelected ? "text-custom-text-100" : "text-custom-text-200")}>
        {label}
      </div>
    </div>
  );
});
