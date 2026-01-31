"use client";

import {
  useEditor,
  EditorContent,
  Editor,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Workflow,
} from "lucide-react";
import { Node, mergeAttributes } from "@tiptap/core";
import MermaidBlock from "./MermaidBlock";

// Initialize lowlight
const lowlight = createLowlight(common);

// Custom Mermaid Extension
const MermaidExtension = Node.create({
  name: "mermaid",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      code: {
        default: "graph TD;\n  A-->B;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "mermaid-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["mermaid-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, updateAttributes }) => {
      return (
        <NodeViewWrapper className="mermaid-component relative group">
          <MermaidBlock code={node.attrs.code} />
          {/* Simple overlay to edit code - in a real app, use a modal or side panel */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border p-2 rounded shadow-lg">
            <button
              onClick={() => {
                const newCode = prompt("Edit Mermaid Code", node.attrs.code);
                if (newCode !== null) {
                  updateAttributes({ code: newCode });
                }
              }}
              className="text-xs font-bold"
            >
              Edit Diagram
            </button>
          </div>
        </NodeViewWrapper>
      );
    });
  },
});

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addMermaid = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "mermaid",
        attrs: {
          code: "graph TD;\n A[Start] --> B{Is it?};\n B -- Yes --> C[OK];\n C --> D[Rethink];\n D --> B;\n B -- No --> E[End];",
        },
      })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-bg-primary/50 border-b border-border/10 p-2 flex flex-wrap gap-2 items-center sticky top-0 z-10 backdrop-blur-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("bold") ? "bg-muted text-primary" : ""
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("italic") ? "bg-muted text-primary" : ""
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("strike") ? "bg-muted text-primary" : ""
        }`}
        title="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("code") ? "bg-muted text-primary" : ""
        }`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("bulletList") ? "bg-muted text-primary" : ""
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("orderedList") ? "bg-muted text-primary" : ""
        }`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("blockquote") ? "bg-muted text-primary" : ""
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("codeBlock") ? "bg-muted text-primary" : ""
        }`}
        title="Code Block"
      >
        <Code className="w-4 h-4 text-blue-500" />
      </button>
      <button
        onClick={addMermaid}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("mermaid") ? "bg-muted text-primary" : ""
        }`}
        title="Flowchart / Mermaid"
      >
        <Workflow className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive("link") ? "bg-muted text-primary" : ""
        }`}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-muted"
        title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

interface BlogEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

const BlogEditor = ({
  content,
  onChange,
  editable = true,
}: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      MermaidExtension, // Add custom extension
    ],
    immediatelyRender: false,
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 text-foreground",
      },
    },
  });

  return (
    <div
      className={`w-full ${
        editable ? "shadow-xl secondary-background" : ""
      } rounded-xl overflow-hidden bg-bg-secondary`}
    >
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="min-h-[300px] p-2" />
    </div>
  );
};

export default BlogEditor;
