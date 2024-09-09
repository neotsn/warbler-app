import React, { Component } from 'react';
import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Add } from '@mui/icons-material';
import UserIdRow from './UserIdRow';

const styles = (theme) => ({
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(0, 1, 1)
  }
});

class UserIdsContainer extends Component {
  static defaultUser = { name: '', email: '' };

  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      userIDs: []
    };
  }

  componentDidMount() {
    this.doAddDefaultUser();
  }

  doAddDefaultUser() {
    if (this.state.userIDs.length === 0) {
      const { user } = this.props;
      const { username } = user || {};
      const defaultUser = { name: `@${username}`, email: '' };

      const userIDs = [defaultUser];

      this.setState({ userIDs });
    }
  }

  onAddUserId() {
    let { userIDs } = this.state;

    userIDs.push(Object.assign({}, UserIdsContainer.defaultUser));

    this.setState({ userIDs });
    this.props.onChangeUserIds({ userIDs });
  };

  onChangeUserId({ index, name, email }) {
    let { userIDs } = this.state;

    userIDs[index].name = name;
    userIDs[index].email = email;

    this.setState({ userIDs });
    this.props.onChangeUserIds({ userIDs });
  };

  onDeleteUserId({ index }) {
    const { userIDs } = this.state;

    // Drop this index...
    delete userIDs[index];

    if (Object.values(userIDs).length === 0) {
      // No more userIDs, so put one back...
      userIDs.push(Object.assign({}, UserIdsContainer.defaultUser));
    }

    this.setState({ userIDs });
    this.props.onChangeUserIds({ userIDs });
  };

  render() {
    return (
      <div>
        <div id={'userid-rows'}>
          {Object.values(this.state.userIDs).map((userData, index) => {
            return <UserIdRow
              key={index}
              index={index}
              name={userData.name}
              email={userData.email}
              onChangeUserId={this.onChangeUserId.bind(this)}
              onDeleteUserId={this.onDeleteUserId.bind(this)}
              showDelete={Object.values(this.state.userIDs || []).length > 1}
            />;
          })}
        </div>
        <div className={this.classes.controls}>
          <Button
            variant={'contained'}
            color={'secondary'}
            startIcon={<Add/>}
            onClick={this.onAddUserId.bind(this)}
          >Add User ID</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserIdsContainer);
