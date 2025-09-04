interface Props {
  detailViewerPath: string;
  onCloseViewer: () => void;
}

export default function DetailViewerHeader({
  detailViewerPath,
  onCloseViewer,
}: Props) {
  return (
    <div
      style={{
        width: 'auto',
        flexDirection: 'row',
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        height: '30px',
      }}
    >
      <div
        style={{
          minWidth: '0',
          flex: '1 1 auto',
          color: '#888',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {detailViewerPath.replace(/.*\\/, '')}
      </div>
      <button
        type="button"
        onClick={onCloseViewer}
        style={{ width: 'auto', height: '80%', flex: '0 0 auto' }}
      >
        Exit
      </button>
    </div>
  );
}
