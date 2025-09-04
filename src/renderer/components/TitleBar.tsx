interface Props {
  onClickOpen: () => void;
}

export default function TitleBar({ onClickOpen }: Props) {
  // const onClickFiles = (onClickOpen) => {
  //   console.log('settings clicked');
  //   // window.myAPI.openSettings();
  // };
  return (
    <header className="header">
      <button className="titlebar-button" type="button" onClick={onClickOpen}>
        Files(F)
      </button>
      <div className="app-title">PickPics</div>
    </header>
  );
}
