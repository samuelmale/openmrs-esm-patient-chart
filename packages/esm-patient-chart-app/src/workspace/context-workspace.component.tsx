import React, { useEffect, useState } from 'react';
import ArrowRight16 from '@carbon/icons-react/es/arrow--right/16';
import Maximize16 from '@carbon/icons-react/es/maximize/16';
import Minimize16 from '@carbon/icons-react/es/minimize/16';
import styles from './context-workspace.scss';
import {
  ExtensionSlot,
  useLayoutType,
  useBodyScrollLock,
  useAssignedExtensionIds,
  detach,
  useExtensionSlot,
  updateExtensionStore,
} from '@openmrs/esm-framework';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from 'carbon-components-react/es/components/UIShell';
import { useWorkspace } from '../hooks/useWorkspace';
import { patientChartWorkspaceSlot } from '../constants';
import { isDesktop } from '../utils';
import { useContextWorkspace } from '../hooks/useContextWindowSize';

interface ContextWorkspaceParams {
  patientUuid: string;
}

export function detachByExtensionIndex(extensionSlotName: string, index: number) {
  console.log('Dettaching.....');
  updateExtensionStore((state) => {
    const existingSlot = state.slots[extensionSlotName];
    console.log(JSON.stringify(existingSlot));
    if (existingSlot) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: existingSlot.attachedIds.splice(index, 1),
          },
        },
      };
    } else {
      return state;
    }
  });
}

const ContextWorkspace: React.FC<RouteComponentProps<ContextWorkspaceParams>> = ({ match }) => {
  const layout = useLayoutType();
  const { patientUuid } = match.params;
  const { t } = useTranslation();
  const isTablet = layout === 'tablet';
  const { active, title, closeWorkspace, extensions } = useWorkspace();
  const { windowSize, updateWindowSize } = useContextWorkspace();
  const { size } = windowSize;
  const props = React.useMemo(
    () => ({ closeWorkspace, patientUuid, isTablet }),
    [closeWorkspace, isTablet, patientUuid],
  );

  const [openContextWorkspace, setOpenContextWorkspace] = useState(false);
  const currentExtensions = useAssignedExtensionIds(patientChartWorkspaceSlot);

  const slotFeed = useExtensionSlot(patientChartWorkspaceSlot);

  useEffect(() => {
    if (currentExtensions.length > 1) {
      const ext = currentExtensions[0];
      // launch the dialog
      const closeExistingForm = true;
      if (closeExistingForm) {
        detachByExtensionIndex(patientChartWorkspaceSlot, 0);
      }
    }
  }, [currentExtensions]);

  useEffect(() => {
    console.log(slotFeed.extensions);
  }, [slotFeed.extensions]);

  useEffect(() => {
    if (extensions.length > 0 && (size === 'maximize' || size === 'normal')) {
      setOpenContextWorkspace(true);
    } else if (extensions.length > 0 && size === 'hide') {
      setOpenContextWorkspace(false);
    } else {
      setOpenContextWorkspace(false);
    }
  }, [extensions.length, size]);

  useBodyScrollLock(active && !isDesktop(layout));

  const Icon = size === 'maximize' ? Minimize16 : Maximize16;

  return (
    <aside
      className={`${styles.contextWorkspaceContainer} ${openContextWorkspace ? styles.show : styles.hide} ${
        size === 'maximize' && styles.maximized
      }`}>
      <Header aria-label={title} style={{ position: 'sticky' }}>
        <HeaderName prefix="">{title}</HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            onClick={() => {
              size === 'maximize' ? updateWindowSize('minimize') : updateWindowSize('maximize');
            }}
            aria-label={t('maximize', 'Maximize')}
            title={t('maximize', 'Maximize')}>
            <Icon />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label={t('hide', 'Hide workspace')}
            title={t('hide', 'Hide workspace')}
            onClick={() => updateWindowSize('hide')}>
            <ArrowRight16 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <ExtensionSlot extensionSlotName={patientChartWorkspaceSlot} state={props} />
    </aside>
  );
};

export default ContextWorkspace;
