import { ToggleSwitch } from "@plane/ui";
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";

const UpdateToggle: React.FC = observer(() => {

  const { viewIssuesFilter: {isEditing, updateEditing} } = useMobxStore();

  return (
    <div className="flex items-center gap-2 border rounded p-1">
      <label className="text-sm">Edit mode:</label>
      <ToggleSwitch
        label="Edit mode"
        value={isEditing}
        onChange={updateEditing}
      />
    </div>
  );
});

export default UpdateToggle;
