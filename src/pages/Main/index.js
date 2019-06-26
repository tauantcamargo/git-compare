/* eslint-disable import/order */
import { Container, Form } from './styles';

import CompareList from '../../components/CompareList/index';
import Logo from '../../assets/logo.png';
import React from 'react';
import api from '../../services/api';
import { isEmpty } from 'lodash';
import moment from 'moment';

class Main extends React.Component {
  state = {
    loading: false,
    repositoryTypoError: false,
    repositoryInput: '',
    repositories: [],
  }

  handleRepositoryInput = (e) => {
    this.setState({ repositoryInput: e.target.value });
  }

  handleAddRepository = async (e) => {
    e.preventDefault();
    const { repositoryInput, repositories } = this.state;
    const checkRepositoryTag = repository => repository.repositoryTag === repositoryInput;
    const hasRepository = repositories.some(checkRepositoryTag);

    this.setState({ loading: true });

    if (!hasRepository) {
      try {
        const { data: repository } = await api.get(`/repos/${repositoryInput}`);

        repository.lastCommit = moment(repository.pushed_at).fromNow();
        repository.repositoryTag = repositoryInput;

        this.setState({
          repositoryInput: '',
          repositories: [...repositories, repository],
          repositoryTypoError: false,
        });
      } catch (err) {
        this.setState({ repositoryTypoError: true });
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ repositoryTypoError: true });
    }
  }

  render() {
    const { repositories, repositoryInput, repositoryTypoError, loading } = this.state;
    const isRepositoriesEmpty = isEmpty(repositories);

    return (
      <Container>
        <img src={Logo} alt="Github compare" />

        <Form withError={repositoryTypoError} onSubmit={this.handleAddRepository}>
          <input type="text" placeholder="user/repo" value={repositoryInput} onChange={this.handleRepositoryInput} />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : <i className="fa fa-plus" />}</button>
        </Form>

        {!isRepositoriesEmpty && <CompareList repositories={repositories} />}
      </Container>
    );
  }
}

export default Main;
