import React from 'react'

class ClearButton extends React.Component{
    isOperator = val =>{
        return !isNaN(val) || val==='.' || val==='='
    }
    render(){
        return(
            <div className='button clear'
            onClick={() => this.props.handleClear()}
            >
                {this.props.children}
            </div>
        )
    }
}
export default ClearButton