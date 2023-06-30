import React, {useState} from "react";

function InputArea(props) {

    const [inputText, setInputText] = useState("");

    function handleChange(event) {
        const newValue = event.target.value;
        setInputText(newValue);
    }


    return (
        <div className="form">
            <input onChange={props.onChange} type="text" value={props.Value} />
            <button onClick={props.onClick}>
                <span>Add</span>
            </button>
        </div>
    )
}
