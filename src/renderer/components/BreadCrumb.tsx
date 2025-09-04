interface Props {
  dirPath: string;
  onReload: () => void;
  onDelete: (dirPath: string) => void;
  onCloseViewer: () => void;
  // reloadController: boolean;
}

export default function BreadCrumb({
  dirPath,
  onReload,
  onDelete,
  onCloseViewer,
  // reloadController,
}: Props) {
  return (
    <div
      key={dirPath}
      style={{
        height: '20px',
        display: 'flex',
        flexDirection: 'row',
        padding: '3px 10px',
        alignItems: 'center',
        borderBottom: '1px solid #000',
      }}
    >
      <ol className="breadcrumb">
        {dirPath
          .split('\\')
          .filter((_, index, array) => index > array.length - 4)
          .map((path) => (
            <li className="breadcrumb-item" key={path}>
              {path}
            </li>
          ))}
      </ol>
      <button type="button" onClick={onReload} style={{ marginLeft: 'auto' }}>
        Reload
      </button>
      <button
        type="button"
        onClick={() => {
          onDelete(dirPath);
          onCloseViewer();
        }}
      >
        Close
      </button>
    </div>
  );
}
