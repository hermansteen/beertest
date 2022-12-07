import React, { useState, useEffect } from 'react';

const Slider = ( {onClick, onClear}) => {
    const [value, setValue] = useState('');
    let checked = false;
    //Detta är så dumt så det måste lösas på något sätt
    return ( <> 
    
    {!checked && <p>Beer Me!</p>}
    {checked && <p>Wine Me!</p>}
        <label className="switch">
            <input type="checkbox" value = {value} onClick = {(e) => {
                setValue(e.target.value);
                onClick(e.target.value);

            }}  />
        <span className="sliderRound"></span>
        </label>  
        </>       
    );
}

export default Slider;