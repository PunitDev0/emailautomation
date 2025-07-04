import BlockEditor from "./BlockEditor";

const StructurePanel = ({
  blocks,
  selectedBlock,
  setSelectedBlock,
  viewMode,
  setViewMode,
  htmlCode,
  setHtmlCode,
  applyCodeChanges,
  globalSettings,
  updateBlock,
  duplicateBlock,
  deleteBlock,
  handleImageUpload,
  clearImage,
}) => {
  return (
    <div className="w-80 bg-white border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Structure</h2>
      <div className="flex mb-4">
        <button
          onClick={() => setViewMode("visual")}
          className={`mr-2 px-4 py-2 ${viewMode === "visual" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Visual
        </button>
        <button
          onClick={() => setViewMode("code")}
          className={`px-4 py-2 ${viewMode === "code" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Code
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {viewMode === "visual" ? (
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`p-2 border ${selectedBlock === block.id ? "border-black" : "border-gray-300"}`}
                onClick={() => setSelectedBlock(block.id)}
              >
                <span>{block.type}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-64 p-2 border"
            />
            <button
              onClick={applyCodeChanges}
              className="mt-2 px-4 py-2 bg-black text-white"
            >
              Apply Changes
            </button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <BlockEditor
          blocks={blocks}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          globalSettings={globalSettings}
          updateBlock={updateBlock}
          duplicateBlock={duplicateBlock}
          deleteBlock={deleteBlock}
          handleImageUpload={handleImageUpload}
          clearImage={clearImage}
        />
      </div>
    </div>
  );
};

export default StructurePanel;