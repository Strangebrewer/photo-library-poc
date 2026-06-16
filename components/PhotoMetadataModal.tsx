"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/Modal";
import { getFolders } from "@/app/actions/folders";
import { getTags } from "@/app/actions/tags";

type FolderOption = {
  id: string;
  name: string;
  parentId: string | null;
};

export type PhotoMetadata = {
  name: string;
  description: string;
  tags: string[];
  folderId: string;
};

type Props = {
  defaultFolderId: string;
  onSubmit: (metadata: PhotoMetadata) => void;
  onClose: () => void;
};

function buildPath(folders: FolderOption[], id: string): string {
  const map = new Map(folders.map((f) => [f.id, f]));
  const parts: string[] = [];
  let cur = map.get(id);
  while (cur) {
    parts.unshift(cur.name);
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }
  return parts.join(" / ");
}

export default function PhotoMetadataModal({ defaultFolderId, onSubmit, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(defaultFolderId);
  const [folderInput, setFolderInput] = useState("");
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFolders().then(setFolders);
    getTags().then((ts) => setUserTags(ts.map((t) => t.name)));
  }, []);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "") {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), tags, folderId: selectedFolderId });
  }

  const filteredTags = userTags.filter(
    (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t),
  );

  const filteredFolders = folders.filter((f) =>
    buildPath(folders, f.id).toLowerCase().includes(folderInput.toLowerCase()),
  );

  const folderDisplayValue = folderDropdownOpen
    ? folderInput
    : folders.length
      ? buildPath(folders, selectedFolderId)
      : "Loading...";

  return (
    <Modal isOpen={true} close={onClose} closeOnOutsideClick={false}>
      <div className="bg-white rounded-xl w-[90vw] max-w-md max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-gray-900">Add Photo</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div
              className="border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 min-h-[42px] focus-within:border-blue-500 cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="text-blue-600 hover:text-blue-900 leading-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onFocus={() => setTagDropdownOpen(true)}
                onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="flex-1 min-w-[80px] outline-none text-sm bg-transparent"
              />
            </div>
            {tagDropdownOpen && filteredTags.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      onMouseDown={() => addTag(tag)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-700">Save to</label>
            <input
              type="text"
              value={folderDisplayValue}
              onChange={(e) => setFolderInput(e.target.value)}
              onFocus={() => setFolderDropdownOpen(true)}
              onBlur={() => setTimeout(() => setFolderDropdownOpen(false), 150)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            {folderDropdownOpen && filteredFolders.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredFolders.map((folder) => (
                  <li key={folder.id}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        setSelectedFolderId(folder.id);
                        setFolderInput("");
                        setFolderDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${folder.id === selectedFolderId ? "font-medium text-blue-600" : ""}`}
                    >
                      {buildPath(folders, folder.id)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
