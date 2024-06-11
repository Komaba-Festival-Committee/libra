import styles from '@/components/Tabs.module.scss';
import { SetStateAction } from 'react';

type Props = {
  files: FileData[];
  activeTabIndex: number;
  setOpenFiles: (files: SetStateAction<FileData[]>) => void;
  setActiveTabIndex: (index: SetStateAction<number>) => void;
};
export default function ({
  files,
  activeTabIndex,
  setOpenFiles,
  setActiveTabIndex,
}: Props) {
  const setActiveTab = (index: number) => {
    setActiveTabIndex(index);
  };

  const closeTab = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setOpenFiles(newFiles);
    if (index === activeTabIndex && newFiles.length > 0) {
      setActiveTabIndex(newFiles.length - 1);
    } else if (newFiles.length === 0) {
      setActiveTabIndex(0);
    }
  };

  function parseContent(text: string) {
    const lines = text.split('\n');
    const html = lines
      .map((line) => {
        if (line.startsWith('&&')) {
          return `<blockquote>${line.slice(2)}</blockquote>`;
        }

        const headingMatch = line.match(/^\*+(.+)/);
        if (headingMatch) {
          const level = headingMatch[0].lastIndexOf('*') + 1;
          const content = headingMatch[1].trim();
          return `</span><h${level}><span>${content}</span></h${level}><span>`;
        }

        if (line.startsWith('-')) {
          const level = line.lastIndexOf('-') + 1;
          const content = line.slice(level).trim();
          return `</span><li>${content}</li><span>`;
        }

        if (line.includes('$')) {
          return line.replace(/\$(.+?)\$/g, '<strong>$1</strong>');
        }

        return line;
      })
      .join('');

    return `<span>${html}<span>`;
  }

  const renderContent = (content: string) => {
    const parsedContent = parseContent(content);
    return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
  };

  return (
    <div className="w-[78vw]">
      <div className="flex bg-red-300 pt-2 pl-1 rounded-md">
        {files.map((file, index) => (
          <div>
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-1 pt-[3px] pb-[2px] cursor-pointer rounded-tl-[12px] rounded-tr-[12px] relative ml-4
                          ${
                            index === activeTabIndex
                              ? `bg-white
                                  before:absolute before:bg-white before:bottom-[-8px] before:w-[12px] before:h-[12px] before:left-[-12px] before:z-10
                                  after:absolute after:bg-white after:bottom-[-8px] after:w-[12px] after:h-[12px] after:right-[-12px] after:z-10`
                              : ''
                          }
              `}
            >
              <a
                className={`my-[0.1px] px-2 py-1 rounded-[10px]
                            ${
                              index === activeTabIndex
                                ? `bg-white
                                    before:absolute before:bg-red-300 before:bottom-[-8px] before:w-[12px] before:h-[12px] before:left-[-12px] before:z-20 before:rounded-br-[12px]
                                    after:absolute after:bg-red-300 after:bottom-[-8px] after:w-[12px] after:h-[12px] after:right-[-12px] after:z-20 after:rounded-bl-[12px]`
                                : 'bg-red-300 hover:bg-red-200 rounded-lg'
                            }`}
              >
                {file.name.replace('.txt', '')}
                <button
                  onClick={() => closeTab(index)}
                  className="ml-3 cursor-pointer text-slate-800 text-xl rotate-45"
                >
                  +
                </button>
              </a>
            </button>
            <div
              className={`flex h-2 px-1 ml-1 ${
                index === activeTabIndex ? 'bg-white' : 'bg-red-300'
              }`}
            ></div>
          </div>
        ))}
      </div>
      <div className="pt-1 px-4 mt-2 border-slate-500">
        {files.length > 0 ? (
          <div className={styles.content}>
            {renderContent(files[activeTabIndex].content || '')}
          </div>
        ) : (
          <div>No file selected.</div>
        )}
      </div>
    </div>
  );
}
