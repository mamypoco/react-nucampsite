import React, { Component } from "react";
import { Button, Card, CardImg, CardText, Col, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, FormGroup, Label, Modal,ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom'; 
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


function RenderCampsite({campsite}) {
        return (
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }

class CommentForm extends Component {
    constructor(props) {
        super(props);
    this.state = {      
        isModalOpen: false,
        rating: '',
        author: '',
        text: ''           
    };
    
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
    }


    toggleModal() {
        this.setState({
         isModalOpen: !this.state.isModalOpen
    });
    }

    handleSubmit(values) {
        // this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
        // console.log("Current state is: " + JSON.stringify(values));
        // alert("Current state is: " + JSON.stringify(values));
    }
    
    render() {
        return (
            <React.Fragment>
            <Button outline type="submit" color="primary" onClick={this.toggleModal}>
            <i className="fa fa-pencil fa-lg" />    
              {` Submit Comment`}
            </Button>

            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                    <FormGroup>    
                    <div className="form-group">                      
                        <Label htmlFor="rating">Rating</Label>
                        <Col>   
                            <Control.select model=".rating" id="rating" name="rating" className="form-control" >
                                <option>1</option>   
                                <option>2</option> 
                                <option>3</option>                             
                                <option>4</option>
                                <option>5</option>
                            </Control.select>                     
                        </Col>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="author">Your Name</Label>
                        <Col>
                            <Control.text model=".author" id="author" name="author" className="form-control" placeholder="Your Name" 
                            validators={{
                                required,
                                minLength: minLength(2),
                                maxLength: maxLength(15),
                            }}/>
                            <Errors 
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                        }}
                                    />    
                        </Col>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="text">Comment</Label>
                        <Col>
                            <Control.textarea rows="6" model=".text" id="text" name="text" className="form-control" validators={{
                                required,
                                minLength: minLength(10)
                            }}/>
                            <Errors 
                                    className="text-danger"
                                    model=".text"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 10 characters'
                                    }}
                                    />    
                        </Col>
                    </div>
                    <Button type="submit" value="submit" color="primary">Submit</Button>
                    </FormGroup>
                    </LocalForm>    
                </ModalBody>               
            </Modal>        
            </React.Fragment>
        );
    }   
}    



function RenderComments({comments, addComment, campsiteId}) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map((comment) => {
                    return (
                        <div key={comment.id}>
                            <p>{comment.text}<br />
                                -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                            </p>                           
                        </div>                      
                    )
                })} 
                <CommentForm campsiteId={campsiteId} addComment={addComment} />             
            </div>
        );
    }
    return <div />
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
             <div className="container">
                 <div classname="row">
                     <Loading />
                 </div>
             </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row" >
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments}
                        addComment={props.addComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return <div />;
    }

export default CampsiteInfo;