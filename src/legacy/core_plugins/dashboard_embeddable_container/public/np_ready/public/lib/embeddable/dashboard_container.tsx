/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider } from '@kbn/i18n/react';
import { Filter } from '@kbn/es-query';
import { CoreStart } from '../../../../../../../../core/public';
import { RefreshInterval, TimeRange } from '../../../../../../../../plugins/data/public';

import {
  Container,
  ContainerInput,
  EmbeddableInput,
  ViewMode,
  EmbeddableFactory,
  IEmbeddable,
  GetEmbeddableFactory,
  GetActionsCompatibleWithTrigger,
  GetEmbeddableFactories,
} from '../../../../../../embeddable_api/public/np_ready/public';
import { DASHBOARD_CONTAINER_TYPE } from './dashboard_container_factory';
import { createPanelState } from './panel';
import { DashboardPanelState } from './types';
import { DashboardViewport } from './viewport/dashboard_viewport';
import { Query } from '../../../../../../data/public';
import { Start as InspectorStartContract } from '../../../../../../../../plugins/inspector/public';

export interface DashboardContainerInput extends ContainerInput {
  viewMode: ViewMode;
  filters: Filter[];
  query: Query;
  timeRange: TimeRange;
  refreshConfig?: RefreshInterval;
  expandedPanelId?: string;
  useMargins: boolean;
  title: string;
  description?: string;
  isFullScreenMode: boolean;
  panels: {
    [panelId: string]: DashboardPanelState;
  };
}

interface IndexSignature {
  [key: string]: unknown;
}

export interface InheritedChildInput extends IndexSignature {
  filters: Filter[];
  query: Query;
  timeRange: TimeRange;
  refreshConfig?: RefreshInterval;
  viewMode: ViewMode;
  hidePanelTitles?: boolean;
  id: string;
}

export interface ViewportProps {
  getActions: GetActionsCompatibleWithTrigger;
  getEmbeddableFactory: GetEmbeddableFactory;
  getAllEmbeddableFactories: GetEmbeddableFactories;
  overlays: CoreStart['overlays'];
  notifications: CoreStart['notifications'];
  inspector: InspectorStartContract;
  SavedObjectFinder: React.ComponentType<any>;
  ExitFullScreenButton: React.ComponentType<any>;
}

export class DashboardContainer extends Container<InheritedChildInput, DashboardContainerInput> {
  public readonly type = DASHBOARD_CONTAINER_TYPE;

  constructor(
    initialInput: DashboardContainerInput,
    private readonly viewportProps: ViewportProps,
    parent?: Container
  ) {
    super(
      {
        panels: {},
        isFullScreenMode: false,
        filters: [],
        useMargins: true,
        ...initialInput,
      },
      { embeddableLoaded: {} },
      viewportProps.getEmbeddableFactory,
      parent
    );
  }

  protected createNewPanelState<
    TEmbeddableInput extends EmbeddableInput,
    TEmbeddable extends IEmbeddable<TEmbeddableInput, any>
  >(
    factory: EmbeddableFactory<TEmbeddableInput, any, TEmbeddable>,
    partial: Partial<TEmbeddableInput> = {}
  ): DashboardPanelState<TEmbeddableInput> {
    const panelState = super.createNewPanelState(factory, partial);
    return createPanelState(panelState, Object.values(this.input.panels));
  }

  public render(dom: HTMLElement) {
    ReactDOM.render(
      <I18nProvider>
        <DashboardViewport container={this} {...this.viewportProps} />
      </I18nProvider>,
      dom
    );
  }

  protected getInheritedInput(id: string): InheritedChildInput {
    const { viewMode, refreshConfig, timeRange, query, hidePanelTitles, filters } = this.input;
    return {
      filters,
      hidePanelTitles,
      query,
      timeRange,
      refreshConfig,
      viewMode,
      id,
    };
  }
}
