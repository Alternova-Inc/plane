"use client";
import React from "react";
// ui
import { Button, TransferIcon } from "@plane/ui";

type Props = {
  handleClick: () => void;
  canTransferIssues?: boolean;
  disabled?: boolean;
};

export const TransferIssues: React.FC<Props> = (props) => {
  const { handleClick, canTransferIssues = false, disabled = false } = props;
  return (
    <div className="-mt-2 mb-4 flex items-center justify-end px-4 pt-6">
      {canTransferIssues && (
        <div>
          <Button
            variant="primary"
            prependIcon={<TransferIcon color="white" />}
            onClick={handleClick}
            disabled={disabled}
          >
            Transfer Issues
          </Button>
        </div>
      )}
    </div>
  );
};
