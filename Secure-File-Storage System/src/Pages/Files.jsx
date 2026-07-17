import React from "react";
import FileCard from "../Components/FileCard";

const Files = ({ files = [], onDelete }) => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">My Files</h1>

      {files.length === 0 ? (
        <p className="text-gray-400">No files found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {files.map((file) => (
            <FileCard key={file._id} file={file} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Files;
