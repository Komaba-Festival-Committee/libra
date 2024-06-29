import axios from 'axios';
import { useEffect, useState } from 'react';

const years = ['74', '96', '73', '95', '72', '94', '71'];

const FileExplorer = ({
  onFileSelect,
}: {
  onFileSelect: (file: FileData) => void;
}) => {
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get('/api');
      console.log(response.data);
      setFiles([
        ...response.data,
        ...years.map((year) => ({
          _id: `year_${year}`,
          name: year,
          type: 'folder',
          year: year,
          parent_id: null,
        })),
      ]);
    };
    fetchFiles();
  }, []);

  const toggleFolder = (id: string): void => {
    setFiles(
      files.map((file) => {
        if (file._id === id) {
          file.isOpen = !file.isOpen;
        }
        return file;
      }),
    );
  };

  const renderFiles = (
    items: FileData[],
    parentId: string | null = null,
  ): JSX.Element[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => (
        <div key={item._id}>
          {item.type === 'folder' ? (
            <div
              onClick={() => toggleFolder(item._id)}
              className="cursor-pointer font-medium pl-2 py-[0.2em] my-[0.1em] hover:bg-slate-200 rounded"
            >
              {item.isOpen ? '📂' : '📁'} {item.name}
            </div>
          ) : (
            <div
              onClick={() => onFileSelect(item)}
              className="cursor-pointer font-normal pl-2 py-[0.2em] my-[0.1em] hover:bg-slate-200 rounded"
            >
              📄 {item.name.replace('.txt', '')}
            </div>
          )}
          {item.isOpen && (
            <div className="pl-4">{renderFiles(items, item._id)}</div>
          )}
        </div>
      ));
  };

  return (
    <div className="w-[20vw] mr-4 bg-white p-2 rounded drop-shadow-lg overflow-scroll h-[92vh]">
      {renderFiles(files)}
    </div>
  );
};

export default FileExplorer;
