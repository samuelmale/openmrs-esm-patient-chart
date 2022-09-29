import React from 'react';
import { OHRIForm } from '@ohri/openmrs-ohri-form-engine-lib/src/index';

export default function OHRIFormsWorkspaceAdaptor({ patientUuid, formJson, closeWorkspace }) {
  return <OHRIForm formJson={formJson} patientUUID={patientUuid} onSubmit={closeWorkspace} onCancel={closeWorkspace} />;
}
