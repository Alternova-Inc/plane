import { ToggleSwitch } from "@plane/ui";
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";

interface EditToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ViewEditToggle: React.FC = observer(() => {

  const { viewIssuesFilter: {isEditing, updateEditing} } = useMobxStore();

  return (
    <EditToggle value={isEditing} onChange={updateEditing} />
  );

});

export const CycleEditToggle: React.FC = observer(() => {

  const { cycleIssuesFilter: {isEditing, updateEditing} } = useMobxStore();

  return (
    <EditToggle value={isEditing} onChange={updateEditing}/>
  );
})

function EditToggle({value, onChange} : EditToggleProps) {

  return (
    <div className="flex items-center gap-2 border rounded p-1">
      <label className="text-sm">Edit mode:</label>
      <ToggleSwitch
        label="Edit mode"
        value={value}
        onChange={onChange}
      />
    </div>
  );

}
