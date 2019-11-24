import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../../services/api'

import Container from '../../Components/Container'
import { Owner, IssuesList, Loading } from './styles.js'

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
    loading: true,
  }

  componentDidMount = async () => {
    const { match } = this.props
    const repoName = decodeURIComponent(match.params.repository)

    const [repo, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ])

    this.setState({
      repository: repo.data,
      issues: issues.data,
      loading: false,
    })

    // console.log(this.state.repository, this.state.issues)
  }

  render() {
    const { repository, issues, loading } = this.state

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
      </Container>
    )
  }
}

export default Repository
