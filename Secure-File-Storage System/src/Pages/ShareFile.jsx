import { useParams } from "react-router-dom";

const SharePage = () => {
  const { shareId } = useParams();

  const downloadFile = () => {
    window.open(`http://localhost:5000/api/files/public/${shareId}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={downloadFile}
        className="bg-blue-500 text-white p-3 rounded"
      >
        Download File
      </button>
    </div>
  );
};

export default SharePage;
