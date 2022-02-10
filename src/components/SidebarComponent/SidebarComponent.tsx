import React, { memo, useState, useMemo } from 'react';
import { DetailSidebar, Panel, ManagedDataInspector, Tabs, Tab } from 'flipper';
import { Row, TabLabel } from '../..';

interface IProps {
  selectedId: string;
  actions: Row[];
}

const SidebarComponent: React.FC<IProps> = ({ selectedId, actions }) => {
  const [activeTab, setActiveTab] = useState<string>(TabLabel.state);
  const data = useMemo(() => (selectedId === '' ? actions.slice(-1)[0] : actions.find((v) => v.id === selectedId)), [
    selectedId,
    actions,
  ]);

  if (!data) return null;

  const { after, before, action } = data;

  return (
    <DetailSidebar>
      <Panel floating={false} heading='Action'>
        <ManagedDataInspector data={action} collapsed={true} expandRoot={true} />
      </Panel>
      <Panel floating={false} heading='State'>
        <Tabs defaultActive={activeTab} onActive={setActiveTab} active={activeTab}>
          <Tab label={TabLabel.state}>
            <ManagedDataInspector data={after} collapsed={true} expandRoot={true} />
          </Tab>
          <Tab label={TabLabel.diff}>
            <ManagedDataInspector diff={before} data={after} collapsed={true} expandRoot={true} />
          </Tab>
        </Tabs>
      </Panel>
    </DetailSidebar>
  );
};

export default memo(SidebarComponent);
