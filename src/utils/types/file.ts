interface FileData {
  _id: string;
  name: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
  content?: string;
  parent_id?: string | null;
  year: string;
}
