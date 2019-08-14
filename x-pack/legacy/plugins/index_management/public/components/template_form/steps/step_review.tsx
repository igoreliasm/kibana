/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { Fragment } from 'react';
import { i18n } from '@kbn/i18n';
import {
  EuiFlexGroup,
  EuiTitle,
  EuiFlexItem,
  EuiSpacer,
  EuiTabbedContent,
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiText,
  EuiCallOut,
  EuiLink,
  EuiCodeBlock,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { serializeTemplate } from '../../../../common/lib/template_serialization';
import { StepProps } from '../types';

const NoneDescriptionText = () => (
  <FormattedMessage
    id="xpack.idxMgmt.templateForm.stepReview.summaryTab.noneDescriptionText"
    defaultMessage="None"
  />
);

const getDescriptionText = (data: any) => {
  const hasEntries = data && Object.entries(data).length > 0;

  return hasEntries ? (
    <FormattedMessage
      id="xpack.idxMgmt.templateForm.stepReview.summaryTab.yesDescriptionText"
      defaultMessage="Yes"
    />
  ) : (
    <FormattedMessage
      id="xpack.idxMgmt.templateForm.stepReview.summaryTab.noDescriptionText"
      defaultMessage="No"
    />
  );
};

export const StepReview: React.FunctionComponent<StepProps> = ({ template, updateCurrentStep }) => {
  const { name, indexPatterns, version, order } = template;

  const serializedTemplate = serializeTemplate(template);
  const {
    mappings: serializedMappings,
    settings: serializedSettings,
    aliases: serializedAliases,
  } = serializedTemplate;

  const numIndexPatterns = indexPatterns.length;

  const hasWildCardIndexPattern = Boolean(indexPatterns.find(pattern => pattern === '*'));

  const SummaryTab = () => (
    <div data-test-subj="summaryTab">
      <EuiSpacer size="m" />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiDescriptionList textStyle="reverse">
            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.indexPatternsLabel"
                defaultMessage="Index {numIndexPatterns, plural, one {pattern} other {patterns}}"
                values={{ numIndexPatterns }}
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {numIndexPatterns > 1 ? (
                <EuiText>
                  <ul>
                    {indexPatterns.map((indexName: string, i: number) => {
                      return (
                        <li key={`${indexName}-${i}`}>
                          <EuiTitle size="xs">
                            <span>{indexName}</span>
                          </EuiTitle>
                        </li>
                      );
                    })}
                  </ul>
                </EuiText>
              ) : (
                indexPatterns.toString()
              )}
            </EuiDescriptionListDescription>

            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.orderLabel"
                defaultMessage="Order"
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {order ? order : <NoneDescriptionText />}
            </EuiDescriptionListDescription>

            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.versionLabel"
                defaultMessage="Version"
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {version ? version : <NoneDescriptionText />}
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiDescriptionList textStyle="reverse">
            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.settingsLabel"
                defaultMessage="Has index settings"
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {getDescriptionText(serializedSettings)}
            </EuiDescriptionListDescription>
            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.mappingLabel"
                defaultMessage="Has mappings"
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {getDescriptionText(serializedMappings)}
            </EuiDescriptionListDescription>
            <EuiDescriptionListTitle>
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.aliasesLabel"
                defaultMessage="Has aliases"
              />
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription>
              {getDescriptionText(serializedAliases)}
            </EuiDescriptionListDescription>
          </EuiDescriptionList>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );

  const RequestTab = () => {
    const endpoint = `PUT _template/${name || '<templateName>'}`;
    const templateString = JSON.stringify(serializedTemplate, null, 2);
    const request = `${endpoint}\n${templateString}`;

    return (
      <div data-test-subj="requestTab">
        <EuiSpacer size="m" />

        <EuiText>
          <p>
            <FormattedMessage
              id="xpack.idxMgmt.templateForm.stepReview.requestTab.descriptionText"
              defaultMessage="This Elasticsearch request will create this index template."
            />
          </p>
        </EuiText>

        <EuiSpacer size="m" />

        <EuiCodeBlock language="json" isCopyable>
          {request}
        </EuiCodeBlock>
      </div>
    );
  };

  return (
    <div data-test-subj="stepSummary">
      <EuiTitle>
        <h3 data-test-subj="stepTitle">
          <FormattedMessage
            id="xpack.idxMgmt.templateForm.stepReview.stepTitle"
            defaultMessage="Review details for '{templateName}'"
            values={{ templateName: name }}
          />
        </h3>
      </EuiTitle>

      <EuiSpacer size="l" />

      {hasWildCardIndexPattern ? (
        <Fragment>
          <EuiCallOut
            title={
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.indexPatternsWarningTitle"
                defaultMessage="Proceed with caution"
              />
            }
            color="warning"
            iconType="help"
            data-test-subj="indexPatternsWarning"
          >
            <p data-test-subj="indexPatternsWarningDescription">
              <FormattedMessage
                id="xpack.idxMgmt.templateForm.stepReview.summaryTab.indexPatternsWarningDescription"
                defaultMessage="This template contains a wildcard (*) as an index pattern. This will create a catch-all template and apply to all indices."
              />{' '}
              {/* Edit link navigates back to step 1 (logistics) */}
              <EuiLink onClick={updateCurrentStep.bind(null, 1)}>
                <FormattedMessage
                  id="xpack.idxMgmt.templateForm.stepReview.summaryTab.indexPatternsWarningLinkText"
                  defaultMessage="Edit template."
                />
              </EuiLink>
            </p>
          </EuiCallOut>
          <EuiSpacer size="m" />
        </Fragment>
      ) : null}

      <EuiTabbedContent
        data-test-subj="summaryTabContent"
        tabs={[
          {
            id: 'summary',
            name: i18n.translate('xpack.idxMgmt.templateForm.stepReview.summaryTabTitle', {
              defaultMessage: 'Summary',
            }),
            content: <SummaryTab />,
          },
          {
            id: 'request',
            name: i18n.translate('xpack.idxMgmt.templateForm.stepReview.requestTabTitle', {
              defaultMessage: 'Request',
            }),
            content: <RequestTab />,
          },
        ]}
      />
    </div>
  );
};
