import React from "react";
import Input from "./Input";

function Form(props) {
    return (
        <form className="form">
            <Input
                type="text"
                placeholder="Username"
            />
            <Input
                type="password"
                placeholder="password"
            />
            {props.isRegistered === false && (<Input
                type="password"
                placeholder="confirm password"
            />) }
            <button type="submit"> 
                {props.isRegistered ? "Login" : "Register"}
            </button>
        </form>
    )
}

export default Form;