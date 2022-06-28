import React from 'react';
import { TableComposable, Caption, Thead, Tr, Th, Tbody, Td, OuterScrollContainer, ActionsColumn, ExpandableRowContent,TableText } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import { Bullseye, Card, EmptyState, EmptyStateIcon, Spinner, Title } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';


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
    <OuterScrollContainer>
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
                <Td dataLabel={columnNames.tag}>{repo.tags}</Td>
            </Tr>
            ))}
        </Tbody>
      </TableComposable>
    </OuterScrollContainer>
  )
}

export const ComposableTableStriped = (props) => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories = props.repos;
//   [
//     { name: 'Repository 1', branches: 10, prs: 25, workspaces: 5, lastCommit: '2 days ago' },
//     { name: 'Repository 2', branches: 10, prs: 25, workspaces: 5, lastCommit: '2 days ago' },
//     { name: 'Repository 3', branches: 10, prs: 25, workspaces: 5, lastCommit: '2 days ago' },
//     { name: 'Repository 4', branches: 10, prs: 25, workspaces: 5, lastCommit: '2 days ago' }
//   ];

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
            {repositories.map(repo => (
            <Tr key={repo.id}>
                <Td dataLabel={columnNames.review_url}><a href={repo.review_url}>{repo.review_url.split("/+/")[1]}</a></Td>
                <Td dataLabel={columnNames.subject}>{repo.subject}</Td>
                <Td dataLabel={columnNames.review_topic}>{repo.review_topic}</Td>
                <Td dataLabel={columnNames.owner}>{repo.review_owner}</Td>
                <Td dataLabel={columnNames.status}>{repo.review_status}</Td>
                <Td isActionCell><TableText>
                  <Button variant="secondary">{repo.singleAction}</Button>
                </TableText></Td>
            </Tr>
            ))}
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

export const ComposableTableExpandable = (props) => {
  console.log("FROM Table", props.data)
  const repositories = props.data || [
    { aggregate_hash: 'Node 1', commit_hash: '10', component: '2', nestedComponent: <NestedReposTable />, promote_name: <a>Link 1</a> },
    { aggregate_hash: 'Node 2', commit_hash: '3', component: '4', promote_name: <a>Link 2</a> },
    {
      aggregate_hash: 'Node 3',
      commit_hash: '11',
      component: '7',
      promote_name: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      ),
      link: <a>Link 3</a>
    },
    {
      aggregate_hash: 'Node 4',
      commit_hash: '11',
      component: '7',
      promote_name: 'Expandable row content has no padding.',
      link: <a>Link 4</a>,
      noPadding: true
    }
  ];

  const columnNames = {
    aggregate_hash: 'Aggregate Hash',
    commit_hash: 'Commit Hash',
    component: 'Component',
    promote_name: 'Label Name',
    repo_url: 'Repo URL'
  };
  // In this example, expanded rows are tracked by the repo names from each row. This could be any unique identifier.
  // This is to prevent state from being based on row order index in case we later add sorting.
  // Note that this behavior is very similar to selection state.
  const initialExpandedRepoNames = repositories.filter(repo => !!repo.nestedComponent).map(repo => repo.aggregate_hash); // Default to all expanded
  const [expandedRepoNames, setExpandedRepoNames] = React.useState(initialExpandedRepoNames);
  const setRepoExpanded = (repo, isExpanding) =>
    setExpandedRepoNames(prevExpanded => {
      const otherExpandedRepoNames = prevExpanded.filter(r => r !== repo.name);
      return isExpanding ? [...otherExpandedRepoNames, repo.name] : otherExpandedRepoNames;
    });
  const isRepoExpanded = (repo) => expandedRepoNames.includes(repo.name);

  const defaultActions = (repo) => [
    {
      title: 'Some action',
      onClick: () => console.log(`clicked on Some action, on row ${repo.name}`)
    },
    {
      title: <a href="https://www.patternfly.org">Link action</a>
    },
    {
      isSeparator: true
    },
    {
      title: 'Third action',
      onClick: () => console.log(`clicked on Third action, on row ${repo.name}`)
    }
  ];

  return (
    <TableComposable variant='compact' aria-label="Simple table">
      <Thead>
        <Tr>
          <Td />
          <Th>{columnNames.aggregate_hash}</Th>
          <Th>{columnNames.commit_hash}</Th>
          <Th>{columnNames.component}</Th>
          <Th>{columnNames.promote_name}</Th>
          <Th>{columnNames.repo_url}</Th>
        </Tr>
      </Thead>
      {repositories.map((repo, rowIndex) => (
        <Tbody key={repo.repo_hash+repo.timestamp} isExpanded={isRepoExpanded(repo)}>
          <Tr>
            <Td
              expand={
                repo.nestedComponent
                  ? {
                      rowIndex,
                      isExpanded: isRepoExpanded(repo),
                      onToggle: () => setRepoExpanded(repo, !isRepoExpanded(repo))
                    }
                  : undefined
              }
            />
            <Td dataLabel={columnNames.aggregate_hash}>{repo.aggregate_hash}</Td>
            <Td dataLabel={columnNames.commit_hash}>{repo.commit_hash}</Td>
            <Td dataLabel={columnNames.component}>{repo.component}</Td>
            <Td dataLabel={columnNames.promote_name}>{repo.promote_name}</Td>
            <Td dataLabel={columnNames.repo_url}>
              <ActionsColumn items={defaultActions(repo)} />
            </Td>
          </Tr>
          {repo.nestedComponent ? (
            <Tr isExpanded={isRepoExpanded(repo)}>
              <Td
                noPadding={repo.noPadding}
                dataLabel={`${columnNames.name} expended`}
                colSpan={Object.keys(columnNames).length + 1}
              >
                <ExpandableRowContent>{repo.nestedComponent}</ExpandableRowContent>
              </Td>
            </Tr>
          ) : null}
        </Tbody>
      ))}
    </TableComposable>
  );
};


export default {LaunchpadTableStriped, LoadingStateDemo, ComposableTableStriped, ComposableTableExpandable};
