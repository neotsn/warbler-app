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
      userIds: []
    };
  }

  componentDidMount() {
    this.onAddUserId();
  }

  onAddUserId() {
    let { userIds } = this.state;

    userIds.push(Object.assign({}, UserIdsContainer.defaultUser));

    this.setState({ userIds });
    this.props.onChangeUserIds({ userIds });
  };

  onChangeUserId({ index, name, email }) {
    let { userIds } = this.state;

    userIds[index].name = name;
    userIds[index].email = email;

    this.setState({ userIds });
    this.props.onChangeUserIds({ userIds });
  };

  onDeleteUserId({ index }) {
    const { userIds } = this.state;

    // Drop this index...
    delete userIds[index];

    if (Object.values(userIds).length === 0) {
      // No more userIds, so put one back...
      userIds.push(Object.assign({}, UserIdsContainer.defaultUser));
    }

    this.setState({ userIds });
    this.props.onChangeUserIds({ userIds });
  };

  render() {
    return (
      <div>
        <div id={'userid-rows'}>
          {Object.values(this.state.userIds || []).map((userData, index) => {
            return <UserIdRow
              key={index}
              index={index}
              name={userData.name}
              email={userData.email}
              onChangeUserId={this.onChangeUserId.bind(this)}
              onDeleteUserId={this.onDeleteUserId.bind(this)}
              showDelete={Object.values(this.state.userIds || []).length > 1}
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
