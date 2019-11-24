import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import Container from '../../Components/Container'
import { FaGithubAlt, FaSpinner, FaPlus } from 'react-icons/fa'
import { Form, SubmitButton, List } from './styles'

import api from '../../services/api'

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
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
  }

  handleSubmit = async ev => {
    ev.preventDefault()

    this.setState({
      loading: true,
    })

    const { newRepo, repositories } = this.state
    const { data } = await api.get(`/repos/${newRepo}`)
    const repoAttributes = {
      name: data.full_name,
    }

    this.setState({
      repositories: [...repositories, repoAttributes],
      newRepo: '',
      loading: false,
    })
  }

  handleInputChange = ev => {
    const value = ev.target.value
    this.setState({ newRepo: value })
  }

  render() {
    const { newRepo, repositories, loading } = this.state
    return (
      <>
        <Container>
          <h1>
            <FaGithubAlt />
            Repositórios
          </h1>

          <Form onSubmit={this.handleSubmit}>
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

          <List>
            {repositories.map(repo => (
              <li key={repo.name}>
                <span>{repo.name}</span>
                {/* <a>Detalhes</a> */}
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
