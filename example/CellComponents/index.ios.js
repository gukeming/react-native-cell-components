/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Cell,
  CellGroup,
  CellInput,
  TagsInput,
  SelectList,
  ActionSheet,
  ActionItem,
  CellDatePicker,
  CellListProvider,
  CellListItem
} from 'react-native-cell-components';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  StatusBar
} from 'react-native';

export default class CellComponents extends Component {
  constructor(props) {
    super(props);

    this._usersData = require('./names.json');

    this.state = {
      users: this._usersData,
      user: null,
      version: '0.0.0',
      selectingUsers: false,
      selectedUsers: [],
      date: new Date()
    };
  }

  searchUser(q) {
    if (q !== '' || this.state.selectedUsers.length === 0) {
      this.setState({
        selectingUsers: true,
        users: this._usersData.filter((user) => {
          return user.name.includes(q) || user.email.includes(q);
        })
      });
    } else {
      this.setState({
        selectingUsers: false
      });
    }
  }

  removeSelectedUser(user) {
    this.setState({
      selectedUsers: this.state.selectedUsers.filter(u => u.id !== user.id)
    });
  }

  addSelectedUser(user) {
    this.setState({
      selectedUsers: [
        ...this.state.selectedUsers,
        user
      ]
    })
  }

  handleUsersOnChangeText = (q) => {
    this.searchUser(q);
  }

  handleUsersOnRemoveTag = (index) => {
    this.removeSelectedUser(this.state.selectedUsers[index]);
  }

  handleUserItemOnPress = (user, selected) => {
    if (selected) this.addSelectedUser(user);
    else this.removeSelectedUser(user);

    this.setState({
      selectingUsers: false
    });
  }

  handleVersionOnPress = () => {
    this._actionSheet.open();
  }

  handleSelectedVersionOnPress = (version) => {
    this.setState({
      version
    })
  }

  renderActionSheetItems() {
    const versions = [
      '0.0.4',
      '0.0.3',
      '0.0.2',
      '0.0.1',
      '0.0.0'
    ];

    return versions.map((version, i) => {
      return <ActionItem key={'version-' + i} icon="tag" title={version} onPress={() => this.handleSelectedVersionOnPress(version)} />
    })
  }

  handleOnDateSelected = (date) => {
    this.setState({
      date
    })
  }

  handleUserSelectOnPress = (user) => {
    this.setState({
      user
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.header} />
        <ActionSheet ref={component => this._actionSheet = component} >
          {this.renderActionSheetItems()}
          <ActionItem title="Close" destructive />
        </ActionSheet>
        <TagsInput
          ref={component => this._tagsInput = component}
          label="To:"
          tags={this.state.selectedUsers.map((user) => user.name)}
          onChangeText={this.handleUsersOnChangeText}
          onRemoveTag={this.handleUsersOnRemoveTag}
        />
        <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: '#eee' }} >
          <SelectList
            visible={this.state.selectingUsers || this.state.selectedUsers.length === 0}
            animated={false}
            data={this.state.users}
            selected={this.state.selectedUsers}
            icon="person"
            itemTitle="name"
            itemSubtitle="email"
            onItemPress={this.handleUserItemOnPress}
            itemSelectedValidator="id"
            section="country"
          />
          <ScrollView>
            <CellGroup>
              <Cell title="Package" icon="code" value="react-native-cell-components" />
              <Cell title="Version" icon="tag" value={this.state.version} onPress={this.handleVersionOnPress} />
            </CellGroup>
            <CellGroup header="User info" >
              <CellInput title="Username" icon="person" placeholder="Enter username" />
              <CellDatePicker title="Date" value={this.state.date.toLocaleString()} onDateSelected={this.handleOnDateSelected} />
              <CellInput title="About" multiline autoResize rows={5} icon="file" />
            </CellGroup>

            <CellListProvider>
              <CellGroup>
                <CellListItem
                  listData={this._usersData}
                  listItemTitle="name"
                  listItemIcon="person"
                  listItemValidator="id"
                  listSection="country"
                  listSelected={this.state.user}
                  listItemOnPress={this.handleUserSelectOnPress}

                  icon="person"
                  title="Assign"
                  value={this.state.user ? this.state.user.name : 'None'}
                />
              </CellGroup>
            </CellListProvider>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  header: {
    height: 40,
    backgroundColor: '#1abc9c'
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});

AppRegistry.registerComponent('CellComponents', () => CellComponents);
