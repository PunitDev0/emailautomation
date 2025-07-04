import { Input, Label, Textarea, Select, Button } from "@/components/ui";

const BlockEditor = ({
  blocks,
  selectedBlock,
  setSelectedBlock,
  updateBlock,
  duplicateBlock,
  deleteBlock,
  handleImageUpload,
  clearImage,
}) => {
  if (!selectedBlock) {
    return <div className="p-4 text-center text-gray-500">Select a block to edit</div>;
  }

  const block = blocks.find((b) => b.id === selectedBlock);
  if (!block) return null;

  const handleImageChange = (e) => {
    handleImageUpload(block.id, e);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">{block.type} Block</h3>
        <div>
          <button onClick={() => duplicateBlock(block.id)} className="mr-2 text-blue-500">
            Duplicate
          </button>
          <button onClick={() => deleteBlock(block.id)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          className="w-full p-2 border"
          rows={4}
          disabled={block.type === "image" && block.images.length > 0}
        />
      </div>
      {block.type === "button" && (
        <div>
          <Label>URL</Label>
          <Input
            value={block.url || ""}
            onChange={(e) => updateBlock(block.id, { url: e.target.value })}
            className="w-full p-2 border"
          />
        </div>
      )}
      {block.type === "image" && (
        <div>
          <Label>Upload Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border"
          />
          {block.images.length > 0 && (
            <div className="mt-2">
              <Label>Uploaded Images</Label>
              <div className="flex flex-wrap gap-2">
                {block.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Uploaded ${idx + 1}`}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                ))}
              </div>
              <Button onClick={() => clearImage(block.id)} className="mt-2 bg-red-500 text-white">
                Clear Images
              </Button>
            </div>
          )}
          <div className="mt-2">
            <Label>Image Width (px)</Label>
            <Input
              type="number"
              value={block.width || 300}
              onChange={(e) => updateBlock(block.id, { width: parseInt(e.target.value) })}
              className="w-full p-2 border"
            />
          </div>
          <div>
            <Label>Image Height (px)</Label>
            <Input
              type="number"
              value={block.height || 150}
              onChange={(e) => updateBlock(block.id, { height: parseInt(e.target.value) })}
              className="w-full p-2 border"
            />
          </div>
        </div>
      )}
      <div>
        <Label>Font Size (px)</Label>
        <Input
          type="number"
          value={block.style.fontSize || 14}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, fontSize: parseInt(e.target.value) } })
          }
          className="w-full p-2 border"
          disabled={block.type === "image"}
        />
      </div>
      <div>
        <Label>Font Family</Label>
        <Select
          value={block.style.fontFamily || "Arial, sans-serif"}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, fontFamily: e.target.value } })
          }
          className="w-full p-2 border"
          disabled={block.type === "image"}
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Helvetica', sans-serif">Helvetica</option>
          <option value="'Courier New', monospace">Courier New</option>
        </Select>
      </div>
      <div>
        <Label>Line Height</Label>
        <Input
          type="number"
          step="0.1"
          value={block.style.lineHeight || 1.6}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, lineHeight: parseFloat(e.target.value) } })
          }
          className="w-full p-2 border"
          disabled={block.type === "image"}
        />
      </div>
      <div>
        <Label>Color</Label>
        <Input
          type="color"
          value={block.style.color || "#000"}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, color: e.target.value } })
          }
          className="w-full p-2 border"
          disabled={block.type === "image"}
        />
      </div>
      <div>
        <Label>Background Color</Label>
        <Input
          type="color"
          value={block.style.backgroundColor || "transparent"}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, backgroundColor: e.target.value } })
          }
          className="w-full p-2 border"
        />
      </div>
      <div>
        <Label>Text Align</Label>
        <Select
          value={block.style.textAlign || "left"}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, textAlign: e.target.value } })
          }
          className="w-full p-2 border"
          disabled={block.type === "image" && block.images.length === 0}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </Select>
      </div>
      <div>
        <Label>Border Radius (px)</Label>
        <Input
          type="number"
          value={block.style.borderRadius || 0}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, borderRadius: parseInt(e.target.value) } })
          }
          className="w-full p-2 border"
        />
      </div>
      <div>
        <Label>Box Shadow</Label>
        <Input
          value={block.style.boxShadow || "none"}
          onChange={(e) =>
            updateBlock(block.id, { style: { ...block.style, boxShadow: e.target.value } })
          }
          className="w-full p-2 border"
          placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)"
        />
      </div>
      <div>
        <Label>Padding Top (px)</Label>
        <Input
          type="number"
          value={block.style.padding?.top || 0}
          onChange={(e) =>
            updateBlock(block.id, {
              style: { ...block.style, padding: { ...block.style.padding, top: parseInt(e.target.value) } },
            })
          }
          className="w-full p-2 border"
        />
      </div>
      <div>
        <Label>Padding Bottom (px)</Label>
        <Input
          type="number"
          value={block.style.padding?.bottom || 0}
          onChange={(e) =>
            updateBlock(block.id, {
              style: { ...block.style, padding: { ...block.style.padding, bottom: parseInt(e.target.value) } },
            })
          }
          className="w-full p-2 border"
        />
      </div>
      <div>
        <Label>Padding Left (px)</Label>
        <Input
          type="number"
          value={block.style.padding?.left || 0}
          onChange={(e) =>
            updateBlock(block.id, {
              style: { ...block.style, padding: { ...block.style.padding, left: parseInt(e.target.value) } },
            })
          }
          className="w-full p-2 border"
        />
      </div>
      <div>
        <Label>Padding Right (px)</Label>
        <Input
          type="number"
          value={block.style.padding?.right || 0}
          onChange={(e) =>
            updateBlock(block.id, {
              style: { ...block.style, padding: { ...block.style.padding, right: parseInt(e.target.value) } },
            })
          }
          className="w-full p-2 border"
        />
      </div>
    </div>
  );
};

export default BlockEditor;