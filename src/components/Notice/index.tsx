import {
  ReactElement,
  useState,
  createRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {Alert, AlertColor, Snackbar, SnackbarOrigin} from "@mui/material";

interface IOpen {
  message: string;
  type?: AlertColor;
  origin?: SnackbarOrigin;
}

interface INoticRef {
  open: (p: IOpen) => void;
  close: () => void;
}

export const NoticeRef = createRef<null | INoticRef>();

const Notice = (): ReactElement => {
  const [state, setState] = useState(false);
  const time = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertColor>("info");
  const [origin, setOrigin] = useState<SnackbarOrigin>({
    vertical: "top",
    horizontal: "right",
  });

  useEffect(() => {
    if (state) {
      time.current = setTimeout(() => {
        setState(false);
      }, 3000);
    }
    return () => {
      clearTimeout(time.current);
      time.current = null;
    };
  }, [state, type, origin]);

  const close: any = useCallback(() => setState(false), []);

  const open = useCallback(({message, type, origin}: IOpen) => {
    setMessage(message);
    type && setType(type);
    origin && setOrigin(origin);
    setState(true);
  }, []);

  useImperativeHandle(NoticeRef, () => ({close, open}), [close, open]);

  return (
    <Snackbar message={message} open={state} anchorOrigin={origin}
              sx={{
                // top: "10px!important",
                maxWidth: '400px'
              }}
    >
      <Alert onClose={close} severity={type}>
         {message}
      </Alert>
    </Snackbar>
  );
};

export default Notice;
