import data from "../stuff/ListData.json";
import { useState } from "react";
import { Link } from "react-router";

type ListProps = {
  input: string;
};

function List(props: ListProps) {
  const filteredData = data.filter((el) => {
    // if no input, return original
    if (props.input === '') {
      return el;
    } else {
      // return item which contains user input
      return el.name.toLowerCase().includes(props.input);
    }
  })

  return (
    <ul>
      
        {filteredData.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      
    </ul>
  )

}

export function Homepage() {
  const [inputText, setInputText] = useState("");
  let inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  }

  return (
    <>
      <div className="main">
        <h2>Search</h2>
        <div className="search">
          <input onChange={inputHandler} type="text" id="item" placeholder="Enter an ingredient"/>

        </div>
      </div>
      <List input={inputText} />
      <Link to="/inventory">
        <button>Inventory</button>
      </Link>     
    </>
  );
}
