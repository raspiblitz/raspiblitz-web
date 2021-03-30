import React, { Component } from 'react';

export class Home extends Component {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <div className='content-container w-full bg-gray-300 dark:bg-gray-600 dark:text-white'>Dashboard</div>
      </React.Fragment>
    );
  }
}

export default Home;
