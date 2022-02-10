import React, { useState, useMemo } from "react";
import { Row, TabLabel } from "./types";
import { DataInspector, DetailSidebar, Panel, Tabs, Tab } from "flipper-plugin";

interface IProps {
  selectedId: string;
  actions: Row[];
}

export const SidebarComponent: React.FC<IProps> = ({ selectedId, actions }) => {
  const [activeTab, setActiveTab] = useState<string>(TabLabel.state);
  const data = useMemo(
    () =>
      selectedId === ""
        ? actions.slice(-1)[0]
        : actions.find((v) => v.id === selectedId),
    [selectedId, actions],
  );

  let after: any = {};
  let before: any = {};
  let action: any = { payload: undefined, type: undefined };

  if (data) {
    ({ after, before, action } = data);
  }

  return (
    <DetailSidebar>
      <Panel title="Action">
        <DataInspector data={action} collapsed={true} expandRoot={true} />
      </Panel>
      <Panel title="State">
        <Tabs
          defaultActiveKey={activeTab}
          onChange={setActiveTab}
          activeKey={activeTab}
        >
          <Tab tab={TabLabel.state}>
            <DataInspector data={after} collapsed={true} expandRoot={true} />
          </Tab>
          <Tab tab={TabLabel.diff}>
            <DataInspector
              diff={before}
              data={after}
              collapsed={true}
              expandRoot={true}
            />
          </Tab>
        </Tabs>
      </Panel>
    </DetailSidebar>
  );
};
