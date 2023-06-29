import React, {useState} from "react";

function App() {

  /*
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  
  function updateFName(event) {
    const firstName = event.target.value;
    setFName(firstName);
  }

  function updateLName(event) {
    const lastName = event.target.value;
    setLName(lastName);
  }
  */

  const [fullName, setFullName] = useState({
    fName: "",
    lName: ""
  });

  function handleChange(event) {

    // const newValue = event.target.value;
    // const inputName = event.target.name;

    const {value, name} = event.target;

    setFullName((prevValue) => {
      if (name === "fName") {
        return {
          fName: value,
          lName: prevValue.lName
        }
      } else if (name === "lName") {
        return {
          fName: prevValue.fName,
          lName: value
        }
      }

    })
  }


  return (
    <div className="container">
      <h1>Hello {fullName.fName} {fullName.lName}</h1>
      <form>
        <input name="fName" onChange={handleChange} placeholder="First Name" />
        <input name="lName" onChange={handleChange} placeholder="Last Name" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
