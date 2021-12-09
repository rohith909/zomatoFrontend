import React from 'react';
import queryString from 'query-string';
import '../Styles/details.css';
import axios from 'axios';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-tabs/style/react-tabs.css';
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
        width: " 700px",
        height: "600px"
    },
};
const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: " 800px",
        height: "550px"
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            itemsModalIsOpen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            detailsModalIsOpen: false,
            restaurantId: undefined,
            menuItems: [],
            subTotal: 0,
            firstName: undefined,
            lastName: undefined,
            phone_number: undefined,
            email: undefined,
            address: undefined

        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;


        axios({
            url: `https://zomato-clone-9.herokuapp.com/restaurant/${restaurant}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurant })
            })
            .catch(err => console.log(err))

    }

    handelOrder = () => {
        const { restaurantId } = this.state;

        axios({
            url: `https://zomato-clone-9.herokuapp.com/menuitems/${restaurantId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                this.setState({ menuItems: response.data.items, itemsModalIsOpen: true })
            })
            .catch(err => console.log(err))

    }
    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }
    handlePay = () => {
        const { menuItems } = this.state;
        menuItems.filter((items) => {
            if (items.qty == 1) {
                this.setState({ formModalIsOpen: true })
            }
            else {
                toast.info("please select an Item")
            }
        })

    }

    handleModalState = (state, value) => {
        this.setState({ [state]: value })
    }
    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price
        })
        this.setState({ menuItems: items, subTotal: total })
        // toast.success("Item added to cart");
    }

    handelInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }


    //pament functions

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`https://zomato-clone-9.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    Payment = () => {
        const { subTotal, email } = this.state;

        const paymentObj = {
            amount: subTotal,
            email
        };

        this.getData(paymentObj).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }


    details = () => {
        const { email, firstName, lastName, menuItems, address, subTotal, phone_number } = this.state;
        const detailsObj = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            menuItems: menuItems,
            phone_number: phone_number,
            subTotal: subTotal
        };

        axios({
            method: 'POST',
            url: 'https://zomato-clone-9.herokuapp.com/orders',
            headers: { 'Content-Type': 'application/json' },
            data: detailsObj
        })
            .then(response => {
                if (!email || !firstName || !lastName || !address || !phone_number) {
                    toast.info("Please provide all details");
                }
                else {
                    this.setState({
                        loginModalIsOpen: false,
                        email: '',
                        firstName: '',
                        lastName: '',
                        address: '',
                        phone_number: '',
                        menuItems: [],
                        subTotal: subTotal,
                        formModalIsOpen: false,
                        detailsModalIsOpen: true
                    });
                }

                // toast.success("Login Successfull !",{position:"top-center"});
            })
            .catch(err => console.log(err))
    }


    render() {
        const { restaurant, itemsModalIsOpen, menuItems, subTotal, formModalIsOpen, galleryModalIsOpen, detailsModalIsOpen } = this.state;
        return (
            <div>


                <div className="container Aimg" >
                    <button className="p-2 more-img " onClick={() => this.handleModalState('galleryModalIsOpen', true)}>Click to see Image Gallery </button>
                </div>

                <div className="container">

                    <div className="rest-name my-5">{restaurant.name}</div>
                    <button className="btn-order " onClick={this.handelOrder}>Place Online Order</button>

                    <Tabs className="tabs">
                        <TabList>
                            <Tab className="tab">Overview</Tab>
                            <Tab className="tab" >Contact</Tab>
                        </TabList>

                        <TabPanel>
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </TabPanel>
                        <TabPanel >
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </TabPanel>
                    </Tabs>

                </div>

                
                <Modal
                    isOpen={itemsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div style={{ float: 'right' }} className="fas fa-times" onClick={() => this.handleModal('itemsModalIsOpen', false)}></div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button" onClick={() => {
                                this.handleModal('itemsModalIsOpen', false)
                                this.handleModal('formModalIsOpen', true)
                            }}> Pay Now</button>
                            {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>

                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" src={`../${item.image}`} style={{
                                                    height: '75px',
                                                    width: '75px',
                                                    borderRadius: '20px',
                                                    marginTop: '30px',
                                                    marginLeft: '35px'
                                                }} />
                                                {item.qty == 0 ? <div>
                                                    <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                </div> :
                                                    <div className="add-number">
                                                        <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                        <span style={{ backgroundColor: 'white' }}>{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, 'add')}>+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                    overlayClassName="Overlay"
                >
                    <div>
                        <div className="" style={{ fontSize: "24px", float: 'left', margin: '5px', verticalAlign: "null" }} onClick={() => this.handleModalState('formModalIsOpen', false)} ><img src="../../Assets/back-icon.png"></img></div>

                        <div style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('formModalIsOpen', false)}><img src="../../Assets/x.svg" /></div>
                        <h3 className="restaurant-name rest-Name">{restaurant.name}</h3>
                        <div className="form">first Name:</div>  <input className="input" type="text" placeholder="Enter your first Name" id="fname" onChange={(event) => this.handelInputChange(event, 'firstName')} />
                        <div className="form">last Name:</div>  <input className="input" type="text" placeholder="Enter your last Name" id="lname" onChange={(event) => this.handelInputChange(event, 'lastName')} />
                        <div className="form">Mobile Number:</div>  <input className="input" type="text" placeholder="Enter mobile number" id="Mobile Number" onChange={(event) => this.handelInputChange(event, 'phone_number')} />
                        <div className="form">Email:</div>  <input className="input" type="text" placeholder="Enter your email" id="email" onChange={(event) => this.handelInputChange(event, 'email')} />
                        <div className="form">Address:</div>   <textarea className="input_area" id="addr" placeholder="Enter your address" onChange={(event) => this.handelInputChange(event, 'address')} />

                        <div><button className="btn btn-danger proceed" onClick={this.details}>PROCEED</button></div>

                    </div>
                </Modal>


                <Modal
                    isOpen={detailsModalIsOpen}
                    style={customStyles}
                    overlayClassName="Overlay"
                >
                    <div>

                        <div className="" style={{ fontSize: "24px", float: 'left', margin: '5px', verticalAlign: "null" }} ><img src="../../Assets/back-icon.png"></img></div>

                        <div style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('detailsModalIsOpen', false)}><img src="../../Assets/x.svg" /></div>
                        <h3 className="restaurant-name rest-Name">{restaurant.name}</h3>
                        {menuItems.filter((response) => {
                            if (response.qty > 0) {
                                console.log(response.qty);
                            }
                        })}
                        <div>{menuItems.name}{menuItems.qty}</div>

                        <h3 className="item-total">SubTotal : &#8377;{subTotal}</h3>
                        <div><button className="btn btn-danger proceed" onClick={this.Payment}>Pay</button></div>
                    </div>
                </Modal>

                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles2}
                    overlayClassName="abc"
                    className="Modal">

                    <div style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('galleryModalIsOpen', false)}><img src="../../Assets/x-mark-4-32.ico" /></div>

                    <Carousel
                        showArrows={true}
                        showThumbs={false}
                        useKeyboardArrows={true}
                        swipeable={true}>

                        {restaurant && restaurant.thumb && restaurant.thumb.map((img) => {
                            return <div>
                                <img src={img} />
                            </div>
                        })}

                    </Carousel>
                </Modal>


                <ToastContainer theme="colored" />
            </div>
        )
    }
}
export default Details;
