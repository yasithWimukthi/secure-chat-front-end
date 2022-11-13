import FileManage from "./FileManage";
import Message from "./Message";
export const User = () => {
  return (
    <>
      <div className="file-area">
        <FileManage />
      </div>
      <div className="message-area">
        <Message />
      </div>
    </>
  );
};
