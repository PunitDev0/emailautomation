import { forwardRef, useCallback } from "react";

const Preview = forwardRef(
  (
    {
      blocks,
      selectedBlock,
      setSelectedBlock,
      previewMode,
      setPreviewMode,
      globalSettings,
      renderBlock,
    },
    ref
  ) => {
    const getPreviewWidth = useCallback(() => {
      switch (previewMode) {
        case "desktop":
          return "100%";
        case "tablet":
          return "768px";
        case "mobile":
          return "375px";
        default:
          return "100%";
      }
    }, [previewMode]);

    return (
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-4">
          <select
            value={previewMode}
            onChange={(e) => setPreviewMode(e.target.value)}
            className="p-2 border"
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div className="flex justify-center">
          <div
            className="bg-white shadow-md"
            style={{
              width: getPreviewWidth(),
              maxWidth: `${globalSettings.maxWidth}px`,
              fontFamily: globalSettings.fontFamily,
            }}
            ref={ref}
          >
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`p-2 ${
                  selectedBlock === block.id ? "border-2 border-black" : "border border-gray-300"
                }`}
                onClick={() => setSelectedBlock(block.id)}
              >
                {renderBlock(block)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default Preview;