import { useEffect } from "react";

const TOAST_TYPE = {
  error: "bg-red-600",
  success: "bg-green-600",
};

const TOAST_TYPE_FONT = {
  error: "text-red-600",
  success: "text-green-600",
};

export default function Toast({
  message = "",
  type = "",
  show = "",
  toggleToast = () => {},
}) {
  useEffect(() => {
    let timer = null;
    if (show) {
      timer = setTimeout(() => toggleToast(false), 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [show]);

  return (
    <div
      className={`absolute -bottom-[20%] left-1/2 -translate-x-1/2 flex justify-center items-center rounded-lg h-[50px] max-h[150px] overflow-hidden max-w-[280px] ${
        show
          ? "text-white w-[280px] visible p-2"
          : `${TOAST_TYPE_FONT[type]} w-[0px] invisible p-0`
      } transition-all ease-in-out duration-300 delay-100 ${TOAST_TYPE[type]}`}
    >
      {message}
    </div>
  );
}
