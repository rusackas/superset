/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render } from 'spec/helpers/testing-library';
import { ResourceStatus } from 'src/hooks/apiResources/apiResources';
import type { Resource } from 'src/hooks/apiResources/apiResources';
import type {
  DashboardLineage,
  DatasetLineage,
} from 'src/hooks/apiResources/lineage';
import type { EChartsCoreOption } from 'echarts/core';
import LineageView from './LineageView';

type SankeyLink = { source: string; target: string };

const mockEchart = jest.fn((_props: { echartOptions: EChartsCoreOption }) => (
  <div data-test="lineage-echart" />
));

jest.mock(
  '../../../plugins/plugin-chart-echarts/src/components/Echart',
  () => ({
    __esModule: true,
    default: (props: { echartOptions: EChartsCoreOption }) => mockEchart(props),
  }),
);

const complete = <T,>(result: T): Resource<T> => ({
  status: ResourceStatus.Complete,
  result,
  error: null,
});

const renderedLinks = (): [string, string][] => {
  const { echartOptions } = mockEchart.mock.calls.at(-1)![0];
  const { links } = echartOptions.series as { links: SankeyLink[] };
  return links.map(({ source, target }) => [source, target]);
};

beforeEach(() => {
  mockEchart.mockClear();
});

const dashboardLineage = (
  charts: DashboardLineage['upstream']['charts']['result'],
  datasetChartIds: number[],
): DashboardLineage => ({
  dashboard: { id: 3, title: 'Dash', slug: null, published: true },
  upstream: {
    charts: { count: charts.length, result: charts },
    datasets: {
      count: 1,
      result: [
        {
          id: 1,
          name: 'sql_dataset',
          schema: 'public',
          table_name: 'sql_dataset',
          database_id: 2,
          database_name: 'examples',
          chart_ids: datasetChartIds,
        },
      ],
    },
    databases: {
      count: 1,
      result: [{ id: 2, database_name: 'examples', backend: 'postgresql' }],
    },
  },
  downstream: null,
});

test('dashboard lineage links SQL charts to their dataset', () => {
  render(
    <LineageView
      entityType="dashboard"
      lineageResource={complete(
        dashboardLineage(
          [
            {
              id: 7,
              slice_name: 'SQL chart',
              viz_type: 'table',
              dataset_id: 1,
            },
          ],
          [7],
        ),
      )}
    />,
    { useTheme: true },
  );

  expect(renderedLinks()).toEqual(
    expect.arrayContaining([
      ['chart:7', 'dashboard:3'],
      ['dataset:1', 'chart:7'],
      ['database:2', 'dataset:1'],
    ]),
  );
});

test('dashboard lineage does not link a non-SQL chart to a same-id dataset', () => {
  render(
    <LineageView
      entityType="dashboard"
      lineageResource={complete(
        dashboardLineage(
          [
            {
              id: 7,
              slice_name: 'SQL chart',
              viz_type: 'table',
              dataset_id: 1,
            },
            // Semantic-view chart whose datasource id collides with dataset 1.
            // Edges must come from the dataset's chart_ids, so even a
            // colliding dataset_id must not produce a dataset -> chart link.
            {
              id: 8,
              slice_name: 'Semantic chart',
              viz_type: 'table',
              dataset_id: 1,
            },
          ],
          [7],
        ),
      )}
    />,
    { useTheme: true },
  );

  const links = renderedLinks();
  expect(links).toContainEqual(['dataset:1', 'chart:7']);
  expect(links).toContainEqual(['chart:8', 'dashboard:3']);
  expect(links).not.toContainEqual(['dataset:1', 'chart:8']);
});

test('dataset lineage links dashboards only through charts on the dataset', () => {
  const lineage: DatasetLineage = {
    dataset: {
      id: 1,
      name: 'sql_dataset',
      schema: 'public',
      table_name: 'sql_dataset',
      database_id: 2,
      database_name: 'examples',
    },
    upstream: {
      database: { id: 2, database_name: 'examples', backend: 'postgresql' },
    },
    downstream: {
      charts: {
        count: 1,
        result: [
          {
            id: 7,
            slice_name: 'SQL chart',
            viz_type: 'table',
            dashboard_ids: [3],
          },
        ],
      },
      dashboards: {
        count: 1,
        result: [{ id: 3, title: 'Dash', slug: null, chart_ids: [7] }],
      },
    },
  };

  render(
    <LineageView entityType="dataset" lineageResource={complete(lineage)} />,
    {
      useTheme: true,
    },
  );

  expect(renderedLinks()).toEqual([
    ['database:2', 'dataset:1'],
    ['dataset:1', 'chart:7'],
    ['chart:7', 'dashboard:3'],
  ]);
});
