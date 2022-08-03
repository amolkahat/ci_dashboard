import React from 'react';
import { TableComposable, Caption, Thead, Tr, Th, Tbody, Td, OuterScrollContainer, ActionsColumn, ExpandableRowContent,TableText } from '@patternfly/react-table';
import { Button, innerDimensions } from '@patternfly/react-core';
import { Bullseye, Card, EmptyState, EmptyStateIcon, Spinner, Title, EmptyStateVariant, EmptyStateBody, } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Checkbox } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

export const EmptyStateRow = <Tr>
  <Td colSpan={8}>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
          No results found
      </Title>
      <EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
      <Button variant="link">Clear all filters</Button>
      </EmptyState>
    </Bullseye>
  </Td>
</Tr>


export const DynamicTable = (props) => {
  const head = props.head;
  const data = props.data;

  function tableRows(table_rows){
    return table_rows.map(data => {
      Object.entries(data).map((key, value) => {
        Object.entries(value).map((v)=> {
          console.log("////" + v)
        })
        console.log(key + " ===== " + value)
      })
      console.log(data, data.job_name)
      return  data.map(inner_data => (
              <Tr key={inner_data.uuid}>
                {/* <Td key="1">{inner_data.job_name_id}</Td> */}
                <Td key="2"><a href={inner_data.tests_log_url}>Logs</a></Td>
                {/* <Td key="3">{inner_data.duration}</Td> */}
                {/* <Td key="4">{inner_data.end_time}</Td>
                <Td key="5">{inner_data.event_timestamp}</Td> */}
                <Td key="6">{inner_data.project}</Td>
                <Td key="7">{inner_data.pipeline}</Td>
                <Td key="8">{inner_data.result}</Td>
                <Td key="9">{inner_data.voting}</Td>
                <Td key="10">{inner_data.job_tests.split(",").join("<br/>")}</Td>
              </Tr>
          ));
     });
  }

  return (
    <OuterScrollContainer>
      <TableComposable variant='compact' aria-label='Dynamic Table' isStriped>
        <Caption>Dynamic Table</Caption>
        <Thead>
          <Tr>
            {head.map((value, index) => {
              return <Td key={index}>{value}</Td>
            })}
          </Tr>
        </Thead>
        <Tbody>
          {console.log("FromTable", data)}
          {tableRows(data)}
        </Tbody>
      </TableComposable>
    </OuterScrollContainer>
  )
}


export const LaunchpadTableStriped = (props) => {
  const repositories = props.repos;
  const columnNames = props.columns || {
    id: 'ID',
    title: 'Title',
    status: 'Status',
    tags: 'Tags',
  };

  const title = props.title;
  return (
      <TableComposable variant='compact' aria-label="Simple table" isStriped>
        <Caption>{title}</Caption>
        <Thead>
            <Tr>
            <Th>{columnNames.id}</Th>
            <Th>{columnNames.title}</Th>
            <Th>{columnNames.status}</Th>
            <Th>{columnNames.tags}</Th>
            </Tr>
        </Thead>
        <Tbody>
            {repositories.map(repo => (
            <Tr key={repo.id}>
                <Td dataLabel={columnNames.id}><a href={repo.id}>{repo.id}</a></Td>
                <Td dataLabel={columnNames.status}>{repo.title}</Td>
                <Td dataLabel={columnNames.link}>{repo.status}</Td>
                <Td dataLabel={columnNames.tags}>{repo.tag.toString()}</Td>
            </Tr>
            ))}
        </Tbody>
      </TableComposable>
  )
}

export const ComposableTableStriped = (props) => {
  const repositories = props.repos;
  const columnNames = {
    id: 'ID',
    owner: 'Owner',
    review_url: 'Review URL',
    review_topic: 'Review Topic',
    subject: 'Subject',
    status: "Status",
    action: "Action"
  };

  return (
    <OuterScrollContainer>
        <TableComposable variant='compact' aria-label="Simple table" isStriped>
        <Caption>Review List table</Caption>
        <Thead>
            <Tr>
            <Th>{columnNames.id}</Th>
            <Th>{columnNames.subject}</Th>
            <Th>{columnNames.review_topic}</Th>
            <Th>{columnNames.owner}</Th>
            <Th>{columnNames.status}</Th>
            <Th></Th>
            </Tr>
        </Thead>
        <Tbody>
            {repositories.length > 0 ? repositories.map(repo => (
            <Tr key={repo.id}>
                <Td dataLabel={columnNames.review_url}><a href={repo.review_url}>{repo.review_url.split("/+/")[1]}</a></Td>
                <Td dataLabel={columnNames.subject}>{repo.subject}</Td>
                <Td dataLabel={columnNames.review_topic}>{repo.review_topic}</Td>
                <Td dataLabel={columnNames.owner}>{repo.review_owner}</Td>
                <Td dataLabel={columnNames.status}>{repo.review_status}</Td>
                <Td isActionCell><TableText>
                  <Button variant="secondary" onClick={() => props.done(repo.id)} isAriaDisabled={repo.completed}> Done </Button>
                </TableText></Td>
            </Tr>
            )): EmptyStateRow}
        </Tbody>
        </TableComposable>
    </OuterScrollContainer>
  );
};



export const LoadingStateDemo = (props) => {
    const columns = [
      { title: 'Repositories' },
      { title: 'Branches' },
      { title: 'Pull requests' },
      { title: 'Workspaces' },
      { title: 'Last commit' }
    ];
    const rows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 8 },
            title: (
              <Bullseye>
                <EmptyState>
                  <EmptyStateIcon variant="container" component={Spinner} />
                  <Title size="lg" headingLevel="h2">
                    Loading
                  </Title>
                </EmptyState>
              </Bullseye>
            )
          }
        ]
      }
    ];

    return (
          <Card component="div">
            <Table cells={columns} rows={rows} aria-label="Loading table demo">
              <TableHeader />
              <TableBody />
            </Table>
          </Card>
    );
}


const NestedReposTable = (props) => {
  // In real usage, this data would come from some external source like an API via props.
  const prs = props.prs ||  [
    { name: 'Repository 1', branches: '25', prs: '25', workspaces: '5', lastCommit: '2 days ago' },
    { name: 'Repository 2', branches: '25', prs: '25', workspaces: '5', lastCommit: '2 days ago' },
    { name: 'Repository 3', branches: '25', prs: '25', workspaces: '5', lastCommit: '2 days ago' },
    { name: 'Repository 4', branches: '25', prs: '25', workspaces: '5', lastCommit: '2 days ago' }
  ];

  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
    prs: 'Pull requests',
    workspaces: 'Workspaces',
    lastCommit: 'Last commit'
  };

  return (
    <TableComposable aria-label="Simple table" variant="compact">
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.branches}</Th>
          <Th>{columnNames.prs}</Th>
          <Th>{columnNames.workspaces}</Th>
          <Th>{columnNames.lastCommit}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {prs.map(repo => (
          <Tr key={repo.name}>
            <Td dataLabel={columnNames.name}>{repo.name}</Td>
            <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
            <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
            <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
            <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ComposableTableExpandable = (props) => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories = [
    { name: 'one', branches: 'two', prs: 'a', workspaces: 'four', lastCommit: 'five' },
    {
      name: 'parent 1',
      branches: 'two',
      prs: 'k',
      workspaces: 'four',
      lastCommit: 'five',
      // This `details` structure is just for this example. You can drive expanded content from any kind of data.
      details: { detailFormat: 0, detail1: 'single cell' }
    },
    {
      name: 'parent 2',
      branches: 'two',
      prs: 'b',
      workspaces: 'four',
      lastCommit: 'five',
      details: {
        detailFormat: 1,
        detail1:
          'Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. Lorem ipsum sit dolor. '
      }
    },
    {
      name: 'parent 3',
      branches: '2',
      prs: 'b',
      workspaces: 'four',
      lastCommit: 'five',
      details: { detailFormat: 2, detail1: 'single cell - noPadding' }
    },
    {
      name: 'parent 4',
      branches: '2',
      prs: 'b',
      workspaces: 'four',
      lastCommit: 'five',
      details: { detailFormat: 3, detail1: 'single cell - fullWidth & noPadding' }
    },
    {
      name: 'parent 5',
      branches: '2',
      prs: 'b',
      workspaces: 'four',
      lastCommit: 'five',
      details: {
        detailFormat: 0,
        detail1: "spans 'Repositories and 'Branches'",
        detail2: "spans 'Pull requests' and 'Workspaces', and 'Last commit'"
      }
    },
    {
      name: 'parent 6',
      branches: '2',
      prs: 'b',
      workspaces: 'four',
      lastCommit: 'five',
      details: {
        detailFormat: 1,
        detail1: "fullWidth, spans the collapsible column and 'Repositories'",
        detail2: "fullWidth, spans 'Branches' and 'Pull requests'",
        detail3: "fullWidth, spans 'Workspaces' and 'Last commit'"
      }
    }
  ];

  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
    prs: 'Pull requests',
    workspaces: 'Workspaces',
    lastCommit: 'Last commit'
  };

  // In this example, expanded rows are tracked by the repo names from each row. This could be any unique identifier.
  // This is to prevent state from being based on row order index in case we later add sorting.
  // Note that this behavior is very similar to selection state.
  const initialExpandedRepoNames = repositories.filter(repo => !!repo.details).map(repo => repo.name); // Default to all expanded
  const [expandedRepoNames, setExpandedRepoNames] = React.useState(initialExpandedRepoNames);
  const setRepoExpanded = (repo, isExpanding = true) =>
    setExpandedRepoNames(prevExpanded => {
      const otherExpandedRepoNames = prevExpanded.filter(r => r !== repo.name);
      return isExpanding ? [...otherExpandedRepoNames, repo.name] : otherExpandedRepoNames;
    });
  const isRepoExpanded = (repo) => expandedRepoNames.includes(repo.name);

  const [isExampleCompact, setIsExampleCompact] = React.useState(true);

  return (
    <React.Fragment>
      <Checkbox
        label="Compact"
        isChecked={isExampleCompact}
        onChange={checked => setIsExampleCompact(checked)}
        aria-label="toggle compact variation"
        id="toggle-compact"
        name="toggle-compact"
      />
      <TableComposable aria-label="Expandable table" variant='compact'>
        <Thead>
          <Tr>
            <Th />
            <Th width={25}>{columnNames.name}</Th>
            <Th width={10}>{columnNames.branches}</Th>
            <Th width={15}>{columnNames.prs}</Th>
            <Th width={30}>{columnNames.workspaces}</Th>
            <Th width={10}>{columnNames.lastCommit}</Th>
          </Tr>
        </Thead>
        {repositories.map((repo, rowIndex) => {
          // Some arbitrary examples of how you could customize the child row based on your needs
          let childIsFullWidth = false;
          let childHasNoPadding = false;
          let detail1Colspan = 1;
          let detail2Colspan = 1;
          let detail3Colspan = 1;
          if (repo.details) {
            const { detail1, detail2, detail3, detailFormat } = repo.details;
            const numColumns = 5;
            childIsFullWidth = [1, 3].includes(detailFormat);
            childHasNoPadding = [2, 3].includes(detailFormat);
            if (detail1 && !detail2 && !detail3) {
              detail1Colspan = !childIsFullWidth ? numColumns : numColumns + 1; // Account for toggle column
            } else if (detail1 && detail2 && !detail3) {
              detail1Colspan = 2;
              detail2Colspan = !childIsFullWidth ? 3 : 4;
            } else if (detail1 && detail2 && detail3) {
              detail1Colspan = 2;
              detail2Colspan = 2;
              detail3Colspan = !childIsFullWidth ? 1 : 2;
            }
          }
          return (
            <Tbody key={repo.name} isExpanded={isRepoExpanded(repo)}>
              <Tr>
                <Td
                  expand={
                    repo.details
                      ? {
                          rowIndex,
                          isExpanded: isRepoExpanded(repo),
                          onToggle: () => setRepoExpanded(repo, !isRepoExpanded(repo))
                        }
                      : undefined
                  }
                />
                <Td dataLabel={columnNames.name}>{repo.name}</Td>
                <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
                <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
                <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
                <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
              </Tr>
              {repo.details ? (
                <Tr isExpanded={isRepoExpanded(repo)}>
                  {!childIsFullWidth ? <Td /> : null}
                  {repo.details.detail1 ? (
                    <Td dataLabel="Repo detail 1" noPadding={childHasNoPadding} colSpan={detail1Colspan}>
                      <ExpandableRowContent>{repo.details.detail1}</ExpandableRowContent>
                    </Td>
                  ) : null}
                  {repo.details.detail2 ? (
                    <Td dataLabel="Repo detail 2" noPadding={childHasNoPadding} colSpan={detail2Colspan}>
                      <ExpandableRowContent>{repo.details.detail2}</ExpandableRowContent>
                    </Td>
                  ) : null}
                  {repo.details.detail3 ? (
                    <Td dataLabel="Repo detail 3" noPadding={childHasNoPadding} colSpan={detail3Colspan}>
                      <ExpandableRowContent>{repo.details.detail3}</ExpandableRowContent>
                    </Td>
                  ) : null}
                </Tr>
              ) : null}
            </Tbody>
          );
        })}
      </TableComposable>
    </React.Fragment>
  );
};

export default {DynamicTable, LaunchpadTableStriped, LoadingStateDemo, ComposableTableStriped, ComposableTableExpandable};
