import React, { Component } from "react";


// Http request handler
async function httpRequest(url) {
  let res;
  try {
    res = await fetch(url);
    return res.json();
  } catch (e) {
    throw new Error();
  }
}

// User profile state-less component
export const User = ({ user, deleteUser }) => {
  return (<div className="user">
    <img className="avatar" src={user.avatar} alt={user.first_name} />
    <span className="user-name">{user.first_name} {user.last_name}</span>
    <div onClick={() => { deleteUser(user.id) }} className="delete-button">Delete</div>
  </div>)
}

export class PearsonUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          id: 4,
          first_name: "Eve",
          last_name: "Holt",
          avatar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
        },
        {
          id: 5,
          first_name: "Charles",
          last_name: "Morris",
          avatar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
        },
        {
          id: 6,
          first_name: "Tracey",
          last_name: "Ramos",
          avatar:
            "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
        }
      ]
    };
  }


  // removes duplicate users
  removeDuplicate = (users) => {
    let obj = {};
    for (let i = 0, len = users.length; i < len; i++)
      obj[users[i]['id']] = users[i];
    users = [];
    for (let key in obj)
      users.push(obj[key]);
    return users
  }

  componentDidMount() {
    this.fetchUsers(1, 10)
  }

  // Fetch new users and append to existing users in compnent state
  fetchUsers = (pageNumber = 1, pageSize = 10) => {
    httpRequest('https://reqres.in/api/users?page=' + pageNumber + '&per_page=' + pageSize).then((response) => {
      if (response) {
        this.updateUsers(response.data)
      }
    }, (error) => {

    });
  }

  // update users
  updateUsers = (fetchedUsers) => {
    let users = [...this.state.users, ...fetchedUsers]
    this.setState({ users: this.removeDuplicate(users) })
  }

  // delete user from state
  deleteUser = (userId) => {
    let users = this.state.users.filter(x => x.id !== userId)
    this.setState({ users: users })
  }

  render() {
    const { users } = this.state
    return (
      <div className="pearon-users">
        <h1>Pearson User Management</h1>
        {/* Render users here */}
        <div className="user-list">{users.map(user => (
          <User key={user.id} user={user} deleteUser={this.deleteUser} />
        ))}
        </div>
      </div>
    );
  }
}

