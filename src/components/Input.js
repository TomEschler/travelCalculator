import React from 'react'

class Input extends React.Component{
    // isOperator = val =>{
    //     return !isNaN(val) || val === "." || val === "=";
    // }
    render(){
        return(
            <div className='input'>
                {this.props.children}
            </div>
        )
    }
}
export default Input