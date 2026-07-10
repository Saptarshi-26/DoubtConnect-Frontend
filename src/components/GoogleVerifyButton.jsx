import { useEffect, useRef } from "react";

function GoogleVerifyButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id:
        "125621365309-0uhv6efjfpgo60grcia21h7s6o8qk4ia.apps.googleusercontent.com",
      callback: onSuccess,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 340,
    });
  }, [onSuccess]);

  return <div ref={buttonRef}></div>;
}

export default GoogleVerifyButton;