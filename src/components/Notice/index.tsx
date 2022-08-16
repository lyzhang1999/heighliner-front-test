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

export interface IOpen {
  message: string;
  type?: AlertColor;
  origin?: SnackbarOrigin;
  options?: {
    /**
     * The message show time in second.
     */
    showTime?: number;
  }
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
    horizontal: "center",
  });
  const [options, setOptions] = useState<IOpen['options']>();

  useEffect(() => {
    if (state) {
      // Parse options's show time.
      const showTime =
        options && options.showTime !== undefined && options.showTime > 0
          ? options.showTime * 1000
          : 3000;

      time.current = setTimeout(() => {
        setState(false);
      }, showTime);
    }
    return () => {
      clearTimeout(time.current);
      time.current = null;
    };
  }, [state, type, origin]);

  const close: any = useCallback(() => setState(false), []);

  const open = useCallback(({message, type, origin, options}: IOpen) => {
    setMessage(message);
    type && setType(type);
    origin && setOrigin(origin);
    options && setOptions(options);
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
        {
          (typeof message === 'object') ? JSON.stringify(message) : message
        }
      </Alert>
    </Snackbar>
  );
};

export default Notice;
