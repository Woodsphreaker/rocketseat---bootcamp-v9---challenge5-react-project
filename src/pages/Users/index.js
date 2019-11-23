import React, { Component } from 'react'

import { ButtonConfirm, ButtonCancel } from '../../styles/globalElements'

class TestPage extends Component {
  clickOne = () => {
    alert('one')
  }

  clickTwo = () => {
    alert('two')
  }

  render() {
    return (
      <>
        <ButtonConfirm onClick={this.clickOne}>Confirm</ButtonConfirm>
        <ButtonCancel onClick={this.clickTwo}>Cancel</ButtonCancel>
      </>
    )
  }
}

export default TestPage
