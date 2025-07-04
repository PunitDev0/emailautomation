import { useState, useCallback, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "./Sidebar";
import StructurePanel from "./StructurePanel";
import Preview from "./Preview";

const EmailTemplateBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [viewMode, setViewMode] = useState("visual");
  const [htmlCode, setHtmlCode] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const previewRef = useRef(null);

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    );
    saveToHistory();
  }, []);

  const deleteBlock = useCallback((blockId) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    setSelectedBlock(null);
    saveToHistory();
  }, []);

  const duplicateBlock = useCallback((blockId) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock = { ...blockToDuplicate, id: Date.now().toString() };
      setBlocks((prev) => [...prev, newBlock]);
      saveToHistory();
    }
  }, [blocks]);

  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      style: getDefaultStyle(blockType),
      ...(blockType === "button" ? { url: "#" } : {}),
      ...(blockType === "image" ? { images: [], width: 300, height: 150 } : {}),
    };
    setBlocks((prev) => [...prev, newBlock]);
    saveToHistory();
  }, []);

  const getDefaultContent = useCallback((blockType) => {
    const defaults = {
      header: "<div style='text-align: center;'><img src='https://via.placeholder.com/100' alt='Logo' style='max-width: 100px;'></div>",
      text: "Enter your text here...",
      image: "",
      button: "Click Here",
      product: "<img src='https://via.placeholder.com/50' alt='Product'><br><strong>Product Name</strong><br>QUANTITY: 1",
      footer: "Contact us: <a href='#'>Email</a>",
    };
    return defaults[blockType] || "";
  }, []);

  const getDefaultStyle = useCallback((blockType) => {
    const defaults = {
      header: { padding: { top: 20, bottom: 20, left: 20, right: 20 } },
      text: { padding: { top: 15, bottom: 15, left: 20, right: 20 }, fontSize: 14, color: "#333", fontFamily: "Arial, sans-serif" },
      image: { padding: { top: 15, bottom: 15, left: 20, right: 20 }, textAlign: "center" },
      button: { padding: { top: 10, bottom: 10, left: 20, right: 20 }, textAlign: "center", backgroundColor: "#000", color: "#fff", borderRadius: 5 },
      product: { padding: { top: 15, bottom: 15, left: 20, right: 20 }, textAlign: "center" },
      footer: { padding: { top: 15, bottom: 20, left: 20, right: 20 }, fontSize: 12, color: "#777", textAlign: "center", fontFamily: "Arial, sans-serif" },
    };
    return defaults[blockType] || { padding: { top: 15, bottom: 15, left: 20, right: 20 } };
  }, []);

  const renderBlock = useCallback((block) => {
    const { type, content, style, url, images } = block;
    const paddingStyle = {
      paddingTop: `${style.padding?.top || 0}px`,
      paddingBottom: `${style.padding?.bottom || 0}px`,
      paddingLeft: `${style.padding?.left || 0}px`,
      paddingRight: `${style.padding?.right || 0}px`,
    };

    const baseStyle = {
      ...paddingStyle,
      fontSize: `${style.fontSize || 14}px`,
      color: style.color || "#000",
      textAlign: style.textAlign || "left",
      backgroundColor: style.backgroundColor || "transparent",
      borderRadius: `${style.borderRadius || 0}px`,
      fontFamily: style.fontFamily || "Arial, sans-serif",
      lineHeight: style.lineHeight || "normal",
      boxShadow: style.boxShadow || "none",
    };

    const blockElement = (() => {
      switch (type) {
        case "header":
          return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content }} />;
        case "text":
          return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content }} />;
        case "image":
          return (
            <div style={{ ...baseStyle, display: "flex", flexWrap: "wrap", justifyContent: style.textAlign || "center" }}>
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Image ${idx + 1}`}
                    style={{ maxWidth: `${block.width}px`, maxHeight: `${block.height}px`, margin: "5px" }}
                  />
                ))
              ) : (
                <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content || "<img src='https://via.placeholder.com/300x150' alt='Placeholder'>" }} />
              )}
            </div>
          );
        case "button":
          return (
            <div style={{ textAlign: style.textAlign || "center", ...paddingStyle }}>
              <a
                href={url || "#"}
                style={{
                  display: "inline-block",
                  padding: `${style.padding?.top || 10}px ${style.padding?.right || 20}px ${style.padding?.bottom || 10}px ${style.padding?.left || 20}px`,
                  backgroundColor: style.backgroundColor || "#000",
                  color: style.color || "#fff",
                  textDecoration: "none",
                  borderRadius: `${style.borderRadius || 5}px`,
                  fontSize: `${style.fontSize || 14}px`,
                  fontFamily: style.fontFamily || "Arial, sans-serif",
                }}
              >
                {content}
              </a>
            </div>
          );
        case "product":
          return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content }} />;
        case "footer":
          return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content }} />;
        default:
          return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: content }} />;
      }
    })();

    return <div data-block-id={block.id}>{blockElement}</div>;
  }, []);

  const generateHTML = useCallback(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background: #fff; }
        a { text-decoration: none; }
        @media (max-width: 600px) {
            .email-container { margin: 10px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${blocks
          .map((block) => {
            const style = block.style;
            const paddingStyle = `padding: ${style.padding?.top || 0}px ${style.padding?.right || 0}px ${style.padding?.bottom || 0}px ${style.padding?.left || 0}px;`;
            const baseStyle = `
            font-size: ${style.fontSize || 14}px;
            color: ${style.color || "#000"};
            text-align: ${style.textAlign || "left"};
            background-color: ${style.backgroundColor || "transparent"};
            border-radius: ${style.borderRadius || 0}px;
            ${paddingStyle}
            font-family: ${style.fontFamily || "Arial, sans-serif"};
            line-height: ${style.lineHeight || "normal"};
            box-shadow: ${style.boxShadow || "none"};
          `;

            switch (block.type) {
              case "header":
              case "text":
              case "product":
              case "footer":
                return `<div style="${baseStyle}">${block.content}</div>`;
              case "image":
                return (
                  `<div style="${baseStyle}; display: flex; flex-wrap: wrap; justify-content: ${style.textAlign || "center"};">` +
                  (block.images.length > 0
                    ? block.images
                        .map((img) => `<img src="${img}" alt="Uploaded Image" style="max-width: ${block.width}px; max-height: ${block.height}px; margin: 5px;">`)
                        .join("")
                    : `<div style="${baseStyle}">${block.content || "<img src='https://via.placeholder.com/300x150' alt='Placeholder'>"}</div>`) +
                  `</div>`
                );
              case "button":
                return `<div style="text-align: ${style.textAlign || "center"}; ${paddingStyle}">
                  <a href="${block.url || "#"}" style="display: inline-block; ${baseStyle} text-decoration: none;">${block.content}</a>
                </div>`;
              default:
                return `<div style="${baseStyle}">${block.content}</div>`;
            }
          })
          .join("")}
    </div>
</body>
</html>`;
  }, [blocks]);

  const exportHTML = useCallback(() => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [generateHTML]);

  const saveTemplate = useCallback((templateName) => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    alert(`Template "${templateName}" saved successfully!`);
  }, []);

  const saveToHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), [...blocks]]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex, blocks]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setBlocks([...history[historyIndex - 1]]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setBlocks([...history[historyIndex + 1]]);
    }
  }, [historyIndex, history]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
    saveToHistory();
  }, [blocks]);

  const handleImageUpload = useCallback((blockId, event) => {
    const files = Array.from(event.target.files);
    const validImageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validImageFiles.length !== files.length) {
      alert("Please upload only image files.");
      return;
    }

    const imageURLs = validImageFiles.map((file) => URL.createObjectURL(file));
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, images: [...(block.images || []), ...imageURLs], content: "" }
          : block
      )
    );
    saveToHistory();
  }, []);

  const clearImage = useCallback((blockId) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, images: [], content: getDefaultContent("image") } : block
      )
    );
    saveToHistory();
  }, [getDefaultContent]);

  useEffect(() => {
    if (viewMode === "code") {
      setHtmlCode(generateHTML());
    }
  }, [viewMode, generateHTML]);

  const globalSettings = { maxWidth: 600, fontFamily: "Arial, sans-serif" }; // Define globalSettings here

  const sidebarProps = {
    globalSettings,
    setGlobalSettings: () => {},
    addBlock,
    exportHTML,
    saveTemplate,
    undo,
    redo,
    historyIndex,
    history,
  };

  const structurePanelProps = {
    blocks,
    selectedBlock,
    setSelectedBlock,
    viewMode,
    setViewMode,
    htmlCode,
    setHtmlCode,
    applyCodeChanges: () => {},
    globalSettings,
    updateBlock,
    duplicateBlock,
    deleteBlock,
    handleImageUpload,
    clearImage,
  };

  const previewProps = {
    blocks,
    selectedBlock,
    setSelectedBlock,
    previewMode,
    setPreviewMode,
    globalSettings,
    renderBlock,
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar {...sidebarProps} />
      <StructurePanel {...structurePanelProps} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 p-8 overflow-auto"
            >
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
                    width:
                      previewMode === "desktop"
                        ? "100%"
                        : previewMode === "tablet"
                        ? "768px"
                        : "375px",
                    maxWidth: `${globalSettings.maxWidth}px`,
                    fontFamily: globalSettings.fontFamily,
                  }}
                  ref={previewRef}
                >
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2 ${selectedBlock === block.id ? "border-2 border-black" : "border border-gray-300"}`}
                          onClick={() => setSelectedBlock(block.id)}
                        >
                          {renderBlock(block)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default EmailTemplateBuilder;