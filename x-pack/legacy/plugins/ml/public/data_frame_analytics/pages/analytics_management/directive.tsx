/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml', ['react']);

import { IndexPattern, IndexPatterns } from 'ui/index_patterns';
import { I18nContext } from 'ui/i18n';
import { IPrivate } from 'ui/private';

import { InjectorService } from '../../../../common/types/angular';
// @ts-ignore
import { SearchItemsProvider } from '../../../jobs/new_job/utils/new_job_utils';
// Simple drop-in type until new_job_utils offers types.
type CreateSearchItems = () => {
  indexPattern: IndexPattern;
  savedSearch: any;
  combinedQuery: any;
};

import { KibanaConfigTypeFix, KibanaContext } from '../../../contexts/kibana';

import { Page } from './page';

module.directive('mlDataFrameAnalyticsManagement', ($injector: InjectorService) => {
  return {
    scope: {},
    restrict: 'E',
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
      const indexPatterns = $injector.get<IndexPatterns>('indexPatterns');
      const kbnBaseUrl = $injector.get<string>('kbnBaseUrl');
      const kibanaConfig = $injector.get<KibanaConfigTypeFix>('config');
      const Private = $injector.get<IPrivate>('Private');

      const createSearchItems: CreateSearchItems = Private(SearchItemsProvider);
      const { indexPattern, savedSearch, combinedQuery } = createSearchItems();

      const kibanaContext = {
        combinedQuery,
        currentIndexPattern: indexPattern,
        currentSavedSearch: savedSearch,
        indexPatterns,
        kbnBaseUrl,
        kibanaConfig,
      };

      ReactDOM.render(
        <I18nContext>
          <KibanaContext.Provider value={kibanaContext}>
            <Page />
          </KibanaContext.Provider>
        </I18nContext>,
        element[0]
      );

      element.on('$destroy', () => {
        ReactDOM.unmountComponentAtNode(element[0]);
        scope.$destroy();
      });
    },
  };
});
