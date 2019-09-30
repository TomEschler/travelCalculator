import React from 'react'
import Button from './components/Button'
import Input from './components/Input'
import ClearButton from './components/ClearButton'
import axios from "axios";
import './Styles.css'
import Clock from 'react-live-clock';


class App extends React.Component{
    constructor(props){
        super(props)
        this.state= {
            spent: "",
            input: "",
            previousNumber: "",
            currentNumber: "",
            operator: "",
            result: "",
            fromCurrency: "EUR",
            toCurrency: "USD",
            amount: 1,
            pm: "pm",
            dollar: '$',
            currencies: [],
        }
    }
    addToInput = val => {
        this.setState({input: this.state.input + val})
    }
    addDecimal = val => {
        // only add decimal if there is no current decimal point present in input area
        if(this.state.input.indexOf('.') === -1) {
            this.setState({ input: this.state.input + val })
        }
    }
    addZeroToInput = val => {
        // if this.state.input is not empty then add zero
        if(this.state.input !== "" ){
            this.setState({input: this.state.input + val })
        }
    }
    addToSpent = (e) => {
        this.setState({spent: this.state.spent + this.state.input})
    }
    toTwelve = () => {
        if(this.state.input >= 12 & this.state.input <=24 ){
             this.setState({input: this.state.input - 12 + this.state.pm}) 
             
        }else{
            this.setState({input: this.state.input})
        }
    }
    clearInput = () => {
        this.setState({ input: '' })
    }
    add = () => {
        this.state.previousNumber = this.state.input
        this.setState({input: '' })
        this.state.operator = 'add'
    }
    subtract = () => {
        this.state.previousNumber = this.state.input
        this.setState({input: '' })
        this.state.operator = 'subtract'
    }
    multiply = () => {
        this.state.previousNumber = this.state.input
        this.setState({input: '' })
        this.state.operator = 'multiply'
    }
    divide = () => {
        this.state.previousNumber = this.state.input
        this.setState({input: '' })
        this.state.operator = 'divide'
    }
    
    evaluate = () => {
        this.state.currentNumber = this.state.input
        if(this.state.operator === 'add'){
            this.setState({input: parseFloat(this.state.previousNumber) + parseFloat(this.state.currentNumber)})
        }
        else if(this.state.operator === 'subtract'){
            this.setState({input: parseFloat(this.state.previousNumber) - parseFloat(this.state.currentNumber)})
        }
        else if(this.state.operator === 'multiply'){
            this.setState({input: parseFloat(this.state.previousNumber) * parseFloat(this.state.currentNumber)})
        }
        else if(this.state.operator === 'divide'){
            this.setState({input: parseFloat(this.state.previousNumber) / parseFloat(this.state.currentNumber)})
        }
    }


    // Initializes the currencies with values from the Openrates API
    componentDidMount() {
        axios
            .get("https://vschool-cors.herokuapp.com?url=https://api.openrates.io/latest")
            .then(response => {
                // Initialized with 'EUR' because the base currency is 'EUR'
                // and it is not included in the response
                const currencyAr = ["EUR"]
                for (const key in response.data.rates) {
                    currencyAr.push(key)
                }
                this.setState({ currencies: currencyAr.sort() })
            })
            .catch(err => {
                console.log("Oops, something broke with GET in componentDidMount() - we've got a: ", err.message);
            });
    }
    // Currency Converter


    // Event handler for the conversion BROKEN due to CORS policy
    // https://q777nnrzpw.codesandbox.io/ WORKS here - 
    convertHandler = () => {
        // this.setState({input: this.state.input + val})
        if (this.state.fromCurrency !== this.state.toCurrency) {
            axios.get(`https://vschool-cors.herokuapp.com?url=http://api.openrates.io/latest?base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`)
                .then(response => {
                    const result =  this.state.input * (response.data.rates[this.state.toCurrency]);
                    this.setState({ input: result.toFixed(2) + this.state.dollar})
                })
                .catch(err => {
                    console.log("Oops, something broke with GET in convertHandler() - we've got a: ", err.message);
                });
        } else {
            this.setState({ result: "You can't convert the same currency!" })
        }
    };

    // Updates the states based on the dropdown that was changed
    selectHandler = (event) => {
        if (event.target.name === "from") {
            this.setState({ fromCurrency: event.target.value })
        }
        if (event.target.name === "to") {
            this.setState({ toCurrency: event.target.value })
        }
    }
    render(){
        return(
            <div className='app'>
                <div className='calc-wrapper'>
                    <div className='row'>
                        <div className='location-time'>
                        <Clock format={'h:mm:a'} ticking={true} timezone={'CET'}/>
                        </div>
                        <div className='home-time'> Home &nbsp;
                            <Clock format={'h:mm:a'} ticking={true}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='total-spent'> <span style={{color: 'green'}}>$</span> &nbsp; -{this.state.spent}</div>
                    </div>
                    <div className='row'>
                        <Input>{this.state.input}</Input>
                    </div>
                    <div className='row'>
                        <Button handleClick={this.addToInput}>7</Button>
                        <Button handleClick={this.addToInput}>8</Button>
                        <Button handleClick={this.addToInput}>9</Button>
                        <Button handleClick={this.divide}>/</Button>
                    </div>
                    <div className='row'>
                        <Button handleClick={this.addToInput}>4</Button>
                        <Button handleClick={this.addToInput}>5</Button>
                        <Button handleClick={this.addToInput}>6</Button>
                        <Button handleClick={this.multiply}>*</Button>
                    </div>
                    <div className='row'>
                        <Button handleClick={this.addToInput}>1</Button>
                        <Button handleClick={this.addToInput}>2</Button>
                        <Button handleClick={this.addToInput}>3</Button>
                        <Button handleClick={this.add}>+</Button>
                    </div>
                    <div className='row'>
                        <Button handleClick={this.addDecimal}>.</Button>
                        <Button handleClick={this.addZeroToInput}>0</Button>
                        <Button handleClick={this.evaluate}>=</Button>
                        <Button handleClick={this.subtract}>-</Button>
                    </div>
                    <div className='row crazy'>
                        <button className='button twelve' onClick={this.toTwelve}></button>
                        <button className='button spend' onClick={this.addToSpent}></button>
                        <button className='button convert' onClick={this.convertHandler}>$</button> 
                        <ClearButton handleClear={this.clearInput}>Clr</ClearButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
