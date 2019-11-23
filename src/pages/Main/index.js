import React, { Component } from 'react'

import { FaGithubAlt, FaSpinner, FaPlus } from 'react-icons/fa'
import { Container, Form, SubmitButton } from './styles'

import api from '../../services/api'

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
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

    console.log(repositories)
  }

  handleInputChange = ev => {
    const value = ev.target.value
    this.setState({ newRepo: value })
  }

  render() {
    const { newRepo, loading } = this.state
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
        </Container>
      </>
    )
  }
}
export default Main
