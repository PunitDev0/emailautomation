import { Button } from "@/components/ui/button";
import { Download, Save, Undo, Redo } from "lucide-react";
import { useState } from "react";

const Sidebar = ({
  globalSettings,
  setGlobalSettings,
  addBlock,
  exportHTML,
  saveTemplate,
  undo,
  redo,
  historyIndex,
  history,
}) => {
  const [templateName, setTemplateName] = useState("");

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    saveTemplate(templateName);
    setTemplateName("");
  };

  const blockTypes = ["header", "text", "image", "button", "product", "footer"];

  return (
    <div className="w-80 bg-white border-r p-6">
      <h2 className="text-xl font-bold mb-6">Email Builder</h2>
      <div className="space-y-6">
        <h3 className="text-sm font-medium">Add Blocks</h3>
        <div className="grid grid-cols-2 gap-2">
          {blockTypes.map((type) => (
            <Button
              key={type}
              onClick={() => addBlock(type)}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name..."
            className="w-full p-2 border mb-2"
          />
          <Button onClick={handleSaveTemplate} className="w-full bg-black text-white hover:bg-gray-800 mb-2">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportHTML} className="flex-1 bg-black text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex-1 bg-gray-200 hover:bg-gray-300"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex-1 bg-gray-200 hover:bg-gray-300"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;