import { useRef, useState } from "react";
import { useToast } from "./hooks/useToast";

function App() {
  // useToast = costum hook
  //write useToast instead of useContext(ToastContext)
  const { addToast, removeToast } = useToast();
  const inputRef = useRef();

  // stores toast id, gets it from addToast()
  const [id, setId] = useState();

  function createToast() {
    if (inputRef.current.value === "" || inputRef.current === null) return;


    // used to remove last created toast
    // addToast returns the id of toast so by inserting it it will setID to the toast.id
    setId(addToast(inputRef.current.value, { position: "top-center" }));
    // the second value if addToast allows you to change the options ,
    // change dismiss time or position etc
  }

  return (
    <div className="form">
      <input type="text" ref={inputRef} />
      <button onClick={createToast}>Add toast</button>
      <button onClick={() => id !== null && removeToast(id)}>
        Remove last Toast
      </button>
    </div>
  );
}

export default App;
