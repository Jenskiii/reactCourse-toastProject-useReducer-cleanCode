import { createContext, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "../hooks/useToast";

export const ToastContext = createContext(null);

const DEFAULT_OPTIONS = {
  autoDismiss: true,
  autoDismissTimeout: 5000,
  position: "top-right",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // addToast
  function addToast(
    text,
    // user can add options by itself else takes default values
    { id = crypto.randomUUID(), ...userDefinedOptions } = {}
  ) {
    // groups options + extra added options
    const options = { ...DEFAULT_OPTIONS, ...userDefinedOptions };

    setToasts((currentToasts) => {
      return [...currentToasts, { text, options, id }];
    })

    if(options.autoDismiss){
      setTimeout(() => removeToast(id), options.autoDismissTimeout)
    }

    // when you call addToast you know the id , can be used to delete it or something else
    return id
  }



  // remove toast
  function removeToast(id) {
    setToasts((currentToasts) => {
      return currentToasts.filter((toast) => toast.id !== id);
    });
  }

  // get all the toasts positions and pushes it into a groups based on position
  // all left go into the left group, all right in the right group , etc
  // could be inside useMemo()
  const toastsByPosition = toasts.reduce((grouped, toast) => {
    const { position } = toast.options;
    // if groep doesnt excist create group
    if (grouped[position] == null) {
      grouped[position] = [];
    }

    // else push toast to group
    grouped[position].push(toast);

    // return the group / else value will be undefined
    return grouped;
  }, {});

  return (
    <>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}

        {/* puts content inside div with id "toast-container" at index.html */}
        {/* loops through toastByPosition and creates a group for each position */}
        {createPortal(
          Object.entries(toastsByPosition).map(([position, toasts]) => (
            // content
            <div key={position} className={`toast-container ${position}`}>
              {/* creats a toast for each toast */}
              {toasts.map((toast) => (
                <Toast
                  text={toast.text}
                  key={toast.id}
                  remove={() => removeToast(toast.id)}
                />
              ))}
            </div>
          )),
          document.getElementById("toast-container")
        )}
      </ToastContext.Provider>
    </>
  );
}

function Toast({ text, remove }) {
  return (
    <div className="toast" onClick={remove}>
      {text}
    </div>
  );
}
