'use client';
import FileExplorer from '@/components/FileExplorer';
import Tabs from '@/components/Tabs';
import { useState } from 'react';

export default function Home() {
  const [openFiles, setOpenFiles] = useState<FileData[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleFileSelect = (file: FileData) => {
    const existing = openFiles.findIndex((f) => f.name === file.name);
    if (existing !== -1) {
      setActiveTabIndex(existing);
    } else {
      setOpenFiles([...openFiles, file]);
      setActiveTabIndex(openFiles.length);
    }
  };

  return (
    <div className="container mx-0 p-6">
      <h1 className="font-bold text-2xl pb-4">駒場祭委員会 総括wiki</h1>
      <div className="flex w-[98vw]">
        <FileExplorer onFileSelect={handleFileSelect} />
        <Tabs
          files={openFiles}
          activeTabIndex={activeTabIndex}
          setOpenFiles={setOpenFiles}
          setActiveTabIndex={setActiveTabIndex}
        />
      </div>
    </div>
  );
}
