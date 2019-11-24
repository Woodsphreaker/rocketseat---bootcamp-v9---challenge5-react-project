import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import Container from '../../Components/Container'
import { FaGithubAlt, FaSpinner, FaPlus } from 'react-icons/fa'
import { Form, SubmitButton, List, ErrorMessage } from './styles'

import api from '../../services/api'

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    error: false,
    errorMessage: '',
    loading: false,
  }

  componentDidMount = () => {
    const storageRepositories = localStorage.getItem('repositories')
    if (storageRepositories) {
      this.setState({
        repositories: JSON.parse(storageRepositories),
      })
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { repositories } = this.state
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories))
    }
    console.log(this.state.repositories)
  }

  handleSubmit = async ev => {
    ev.preventDefault()

    this.setState({
      loading: true,
    })

    const { newRepo } = this.state

    try {
      if (this.hasRepository(newRepo)) {
        throw new Error('Duplicate repository')
      }

      const { data } = await api.get(`/repos/${newRepo}`)
      this.listRepos(data)
    } catch (e) {
      const errorMessage = {
        404: 'Repository not found',
        default: e.toString(),
      }[e.response ? e.response.status : 'default']

      this.setState({ error: true, errorMessage, loading: false })
    }
  }

  handleInputChange = ev => {
    const value = ev.target.value
    this.setState({ newRepo: value })
  }

  listRepos = data => {
    const { repositories } = this.state
    const repoAttributes = {
      name: data.full_name,
    }

    this.setState({
      repositories: [...repositories, repoAttributes],
      newRepo: '',
      loading: false,
      error: false,
    })
  }

  hasRepository = repo => {
    const { repositories } = this.state
    return repositories.some(({ name }) => name === repo)
  }

  render() {
    const { newRepo, repositories, loading, error, errorMessage } = this.state
    return (
      <>
        <Container>
          <h1>
            <FaGithubAlt />
            Repositórios
          </h1>

          <Form error={error} onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleInputChange}
              type="text"
              placeholder="Adcionar repositório"
              value={newRepo}
            />
            <SubmitButton loading={loading}>
              {loading ? <FaSpinner /> : <FaPlus />}
            </SubmitButton>
          </Form>

          {error && <ErrorMessage>{errorMessage}</ErrorMessage>}

          <List>
            {repositories.map((repo, i) => (
              <li key={`${repo.name}-${i}`}>
                <span>{repo.name}</span>
                <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                  Detalhes
                </Link>
              </li>
            ))}
          </List>
        </Container>
      </>
    )
  }
}
export default Main
