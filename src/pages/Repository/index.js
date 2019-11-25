import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../../services/api'

import Container from '../../Components/Container'
import {
  Owner,
  IssuesList,
  StateFilter,
  Pagination,
  Loading,
} from './styles.js'

class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes,
      }).isRequired,
    }).isRequired,
  }

  state = {
    repository: {},
    issues: [],
    repoName: '',
    loading: true,
    selectedIssueState: 'open',
    issuesStates: [
      { label: 'All', state: 'all' },
      { label: 'Open', state: 'open' },
      { label: 'Closed', state: 'closed' },
    ],
    page: 1,
  }

  componentDidMount = async () => {
    const { match } = this.props
    const { selectedIssueState, page } = this.state
    const repoName = decodeURIComponent(match.params.repository)

    const [repo, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: `${selectedIssueState}`,
          per_page: 5,
          page,
        },
      }),
    ])

    this.setState({
      repository: repo.data,
      issues: issues.data,
      loading: false,
      repoName,
    })
  }

  filterIssues = async filter => {
    this.setState({
      selectedIssueState: filter,
      page: 1,
    })

    this.loadIssues()
  }

  goToPage = page => {
    this.setState({
      page,
    })
    this.loadIssues()
  }

  loadIssues = async () => {
    const { repoName, selectedIssueState, page } = this.state

    this.setState({
      loading: true,
    })

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: `${selectedIssueState}`,
        per_page: 5,
        page,
      },
    })

    this.setState({
      issues: issues.data,
      loading: false,
    })
  }

  render() {
    const {
      repository,
      issues,
      loading,
      issuesStates,
      selectedIssueState,
      page,
    } = this.state

    if (loading) {
      return <Loading>Carregando ...</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <StateFilter selectedIssueState={selectedIssueState}>
          {issuesStates.map(({ label, state }) => (
            <button
              disabled={selectedIssueState === state}
              key={state}
              onClick={() => this.filterIssues(state)}
            >
              {label}
            </button>
          ))}
        </StateFilter>

        <IssuesList>
          {issues.map(issue => (
            <li key={issue.id.toString()}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={label.id.toString()}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>

        <Pagination>
          <button disabled={page < 2} onClick={() => this.goToPage(page - 1)}>
            Prev
          </button>
          <span>Page {page.toString()}</span>
          <button onClick={() => this.goToPage(page + 1)}>Next</button>
        </Pagination>
      </Container>
    )
  }
}

export default Repository
