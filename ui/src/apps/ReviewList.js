// import Component from the react module
import React, { Component } from "react";
import axios from 'axios';
import { ComposableTableStriped } from "../components/Table";
import BasicPanel from "../components/Panel";

import {
  Button,
  TextInput,
  InputGroup,
  Alert
} from '@patternfly/react-core';
import BasicSpinner from "../components/Spinner";

class ReviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: {
        review_url: "",
        review_status: "",
        added_on: "",
        review_topic: "",
        review_owner: "",
        subject: "",
        completed: false
      },
      newItem: {'review_url': ''},
      error: "",
      taskList: [],
      loading: true,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    this.setState({loading: true}, ()=>{
      this.refreshList();
    })
  }


  refreshList = () => {
    axios //Axios to send and receive HTTP requests
    .get("http://localhost:8000/api/reviews/")
    .then(res => this.setState({ taskList: res.data,
                                 error: "",
                                 newItem:{'review_url': ''},
                                 loading: false }))
    .catch(err => this.setState({error: err}));
  };


  handleSubmit = (item) => {
    if (this.state.newItem.review_url === ""){
      const err = {'message': "Input field is empty."}
      this.setState({error: err})
    }
    else{
      axios
      .post("http://localhost:8000/api/reviews/", item)
      .then((res) => this.refreshList())
      .catch(err => this.setState({error: err}));
    }
  };

  // Done item
  handleDone = (item) => {
    axios
    .post(`http://localhost:8000/api/reviews/${item}`)
    .then((res) => this.refreshList());
  };

  handleOnChange(event) {
    this.setState({
      newItem: {'review_url': event}
    });
  }

  render() {
    return (
      <div>
        <BasicPanel header={this.state.error && <Alert variant="danger" title={this.state.error.response.data.msg ?
                                                                               this.state.error.response.data.msg:
                                                                               this.state.error.message}/>}>
          <InputGroup>
            <TextInput value={this.state.newItem.review_url}
                       name="new_review" id="new_review"
                       onChange={this.handleOnChange}
                       aria-label="New review input"
                       placeholder="Paste URL here"
                       required/>
            <Button onClick={() => this.handleSubmit(this.state.newItem)} id="new_review_submit" variant="primary">
              Add Review
            </Button>
          </InputGroup>
        </BasicPanel>
        {this.state.loading ? <BasicSpinner/> : <ComposableTableStriped repos={this.state.taskList} done={this.handleDone}/>}
        </div>
    );
  }
}
export default ReviewList;
