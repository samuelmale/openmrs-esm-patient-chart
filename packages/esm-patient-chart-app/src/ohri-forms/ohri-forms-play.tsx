import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { Button, FilterableMultiSelect } from '@carbon/react';
import 'ace-builds/webpack-resolver';
import { launchPatientWorkspace, closeWorkspace } from '@openmrs/esm-patient-common-lib';
import styles from './ohri-forms-play.scss';
export default function OHRIFormsPlay({ patientUuid }) {
  const [formJson, setFormJson] = useState(localStorage.getItem('ohri-forms:draft'));
  const [hasErrors, setHasErrors] = useState(false);

  function updateFormJsonInput(value) {
    setHasErrors(false);
    try {
      setFormJson(JSON.parse(value));
      localStorage.setItem('ohri-forms:draft', value);
    } catch (e) {
      setHasErrors(true);
    }
  }

  function launchOHRIForm() {
    launchPatientWorkspace('ohri-forms-workspace', {
      encounterUuid: null,
      formJson,
    });
  }

  return (
    <div>
      <AceEditor
        key={0}
        mode="json"
        theme={'github'}
        onChange={updateFormJsonInput}
        name={'jsonText'}
        placeholder="Enter JSON Text"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          displayIndentGuides: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        className={styles.jsonEditor}
        defaultValue={formJson}
      />
      <hr />
      <Button
        className="form-group"
        style={{ marginTop: '1em' }}
        onClick={() => launchOHRIForm()}
        disabled={!formJson || hasErrors}
      >
        Use Form JSON
      </Button>
    </div>
  );
}
