/** 
 * Download a file that comes from dynamic custom text, 
 * this process will be completed by the client but not fetched from server.
 */

import { CommonProps } from "@/utils/commonType";

interface Props extends CommonProps {
  filename: string;
  content: string;
}

export function DownloadTextInClient({
  filename,
  content,
  children,
  className,
  style
}: Props) {
  const blob = new Blob([content]);
  return (
    <a
      download={filename}
      href={URL.createObjectURL(blob)}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
