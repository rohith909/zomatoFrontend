import React from "react";
import '../Styles/Filter.css';
import Modal from "react-modal";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px brown'
    },
};

class Headers extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            isLoggedIn: false,
            loggedInUser: undefined,
            createAccountModalIsOpen: false,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            password: undefined
        }
    }
    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }
    handleModalState = (state, value) => {
        this.setState({ [state]: value })
    }

    responseGoogle = (response) => {
        console.log(response)
        this.setState({ isLoggedIn: true, loggedInUser: response.profileObj.name, loginModalIsOpen: false })
    }

    responseFacebook = (response) => {
        console.log(response)

        this.setState({ isLoggedIn: true, loggedInUser: response.name, loginModalIsOpen: false })
    }
    componentClicked = (data) => {
        console.warn(data);
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined });
    }
    handelInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }


    handleSignUp = () => {
        const { email, password, firstName, lastName } = this.state;
        const signUpObj = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };
        axios({
            method: 'POST',
            url: 'http://zomato-clone-9.herokuapp.com/signup',
            headers: { 'Content-Type': 'application/json' },
            data: signUpObj
        })
            .then(response => {
                if (!email || !password || !firstName || !lastName) {
                    toast.info("Please provide all details");
                }
                if (response.data.Message === 'User Signed Sucessfully') {
                    this.setState({
                        createAccountModalIsOpen: false,
                        isLoggedIn: true,
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: ''
                    });

                    toast.success(response.data.Message, { position: "top-center" });
                }
            })
            .catch(err => console.log(err))
    }


    handleLogin = () => {
        const { email, password } = this.state;
        const loginObj = {
            email: email,
            password: password
        };
        axios({
            method: 'POST',
            url: 'http://zomato-clone-9.herokuapp.com/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                if (!email || !password) {
                    toast.info("Please provide all details");
                }
                else {
                    this.setState({
                        isLoggedIn: response.data.isAuthenticated,
                        loginModalIsOpen: false,
                        email: '',
                        password: '',
                    });
                    toast.success("Login Successfull !", { position: "top-center" });
                }
            })
            .catch(err => console.log(err))

    }

    signUpClick = () => {
        this.setState({ loginModalIsOpen: false, createAccountModalIsOpen: true })
    }
    loginClick = () => {
        this.setState({ loginModalIsOpen: true, createAccountModalIsOpen: false })
    }
    render() {
        const { loginModalIsOpen, isLoggedIn, loggedInUser, createAccountModalIsOpen } = this.state;
        return (
            <>

                <div className="container-fluid header">
                    <div className="row ">
                        <div className="col-lg-1 col-md-1 col-sm-1 "></div>
                        <div className="col-lg-6 col-md-6 col-sm-4  ">
                            <span className="logo-span">
                                <a href="#" className="logo">e!</a>
                            </span>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6  text-center ">

                            {isLoggedIn ? <div className="login-span">
                                <div className="login">{loggedInUser}</div>
                                <span className="account" onClick={this.handleLogout}>Logout</span>
                            </div> :
                                <div className="login-span">
                                    <div className="login " onClick={() => this.handleModalState('loginModalIsOpen', true)}>Login</div>
                                    <span className="account " onClick={() => this.handleModalState('createAccountModalIsOpen', true)}>Create an account</span>
                                </div>
                            }
                            
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1"></div>
                    </div>
                </div>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                    overlayClassName="Overlay"
                >
                    <div style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('loginModalIsOpen', false)}><img src="../../Assets/x.svg" /></div>
                    <div className="title-text">Login</div>

                    <div><input type="text" className="input-login" placeholder="Enter your email id "></input></div>
                    <div><input type="password" id="pass" className="input-login" placeholder="Enter your password "></input></div>
                    <div ><button className="btn btn-danger login-btn" onClick={this.handleLogin} id="GFG_Button">Login</button></div>

                    <div className="login-divider"></div>
                    <div className="text-center OR">or</div>

                    <div className="google" ><GoogleLogin
                        clientId=""
                        buttonText="Continue with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        overlayClassName="google"
                        cookiePolicy={'single_host_origin'}
                        className="google"
                    /></div>

                    <div ><FacebookLogin
                        appId=""
                        autoLoad={false}
                        fields="name,email,picture"
                        onClick={this.componentClicked}
                        callback={this.responseFacebook}
                        cssClass="facebook"
                        textButton="Continue with facebook"
                        icon="fa-facebook-square"
                    />
                    </div>


                    <span style={{ marginLeft: "65px" }}>Don’t have account?  </span><a style={{ color: "blue" }} onClick={() => this.signUpClick()} style={{ color: "#dc3545" }}>Sign UP</a>


                </Modal>
                <Modal
                    isOpen={createAccountModalIsOpen}
                    style={customStyles}
                    overlayClassName="Overlay"
                >
                    <div>
                        <div style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('createAccountModalIsOpen', false)}><img src="../../Assets/x.svg" /></div>
                        <h3 className="restaurant-name rest-Name">Sign up</h3>
                        <span className="form">  <input className="fname" type="text" placeholder="Enter first name" id="fName" onChange={(event) => this.handelInputChange(event, 'firstName')} /></span>
                        <span className="form"> <input className="lname" type="text" placeholder="Enter last name" id="lName" onChange={(event) => this.handelInputChange(event, 'lastName')} /></span>
                        <div className="form"><input className="input-acc" type="text" placeholder="Enter your email" id="email" onChange={(event) => this.handelInputChange(event, 'email')} /></div>
                        <div className="form">   <input className="input-acc" type="password" id="" placeholder="Enter your password" onChange={(event) => this.handelInputChange(event, 'password')} /></div>
                        <div><button className="btn btn-danger create" onClick={this.handleSignUp} >Create Account</button></div>
                        <div className="login-divider"></div>
                        <div className="text-center OR">or</div>

                        <span className="google" style={{}} ><GoogleLogin
                            clientId=""
                            buttonText="Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            overlayClassName="google"
                            cookiePolicy={'single_host_origin'}
                            className="google-signup"
                        /></span>
                        <span ><FacebookLogin
                            appId=""
                            autoLoad={false}
                            fields="name,email,picture"
                            onClick={this.componentClicked}
                            callback={this.responseFacebook}
                            cssClass="facebook-signup"
                            textButton="facebook"
                            icon="fa-facebook-square"
                        />
                        </span>
                        <br /> <span style={{ marginLeft: "95px" }}>Already have an account? </span><span style={{ color: "#dc3545" }} onClick={() => this.loginClick()}>Login</span>

                    </div>
                </Modal>
                <ToastContainer theme="colored" />
            </>
        )
    }

}
export default Headers;

