import React, { useState, useEffect } from 'react';

const Slider = ( {db}) => {
    const [dataSet, setDataSet] = useState(db);
    //Detta är så dumt så det måste lösas på något sätt
    return ( <> 
    
    {dataSet === "beer" && <p>Beer Me! </p>}
    {dataSet === "wine" && <p>Wine Me! </p>}
        <label className="switch">
            <input type="checkbox" onClick = {(e) => {
                if (dataSet === "beer") {
                    setDataSet("wine");                   
                } else {
                    setDataSet("beer");                               
                }
            }}  />
        <span className="sliderRound"></span>
        </label>  
        </>       
    );
}

export default Slider;