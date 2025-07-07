// EmailTemplateMaker.jsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Eye,
  Save,
  Undo,
  Redo,
  Layout,
  Sparkles,
  Bot,
  Users,
  History,
  Store,
  Tablet,
  Zap,
  Download,
  Bell,
  Menu,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTemplates } from "@/hooks/use-templates";
import Sidebar from "./sidebar";
import Canvas from "./canvas";
import PropertyPanel from "./property-panel";
import PreviewModal from "./preview-modal";
import ExportModal from "./export-modal";
import TemplateLibrary from "./template-library";
import PerformanceMonitor from "./performance-monitor";
import AnimatedBackground from "./ui/animated-background";
import LoadingSpinner from "./ui/loading-spinner";
import AIAssistant from "./features/ai-assistant";
import CollaborationPanel from "./features/collaboration-panel";
import VersionHistory from "./features/version-history";
import AnalyticsDashboard from "./features/analytics-dashboard";
import TemplateMarketplace from "./features/template-marketplace";
import AdvancedEditor from "./features/advanced-editor";
import ResponsiveToolbar from "./ui/responsive-toolbar";
import QuickActions from "./ui/quick-actions";
import NotificationCenter from "./ui/notification-center";

export default function EmailTemplateMaker() {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const canvasRef = useRef(null);

  // Template management
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const { createTemplate, updateTemplate, fetchTemplates } = useTemplates();

  // Responsive hooks
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  // Enhanced feature states
  const [showTemplates, setShowTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(false);

  // New advanced features
  const [darkMode, setDarkMode] = useState(false);
  const [gridSnap, setGridSnap] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [templateName, setTemplateName] = useState("My Email Template");
  const [lastSaved, setLastSaved] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (blocks.length > 0 && currentTemplateId) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [blocks, currentTemplateId]);

  // Responsive layout adjustments
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setPropertyPanelOpen(false);
    } else if (isTablet) {
      setSidebarOpen(false);
      setPropertyPanelOpen(!!selectedBlock);
    } else {
      setSidebarOpen(true);
      setPropertyPanelOpen(!!selectedBlock);
    }
  }, [isMobile, isTablet, selectedBlock]);

  const addBlock = useCallback(
    (type) => {
      const newBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: getDefaultContent(type),
        styles: getDefaultStyles(type),
        position: { x: 0, y: blocks.length * 100 },
        responsive: {
          mobile: getResponsiveStyles(type, "mobile"),
          tablet: getResponsiveStyles(type, "tablet"),
          desktop: getResponsiveStyles(type, "desktop"),
        },
      };

      setUndoStack((prev) => [...prev, blocks]);
      setRedoStack([]);
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlock(newBlock.id);

      // Close sidebar on mobile after adding block
      if (isMobile) {
        setSidebarOpen(false);
      }

      toast({
        title: "Element Added! ✨",
        description: `${getBlockDisplayName(type)} has been added to your email.`,
        duration: 2000,
      });
    },
    [blocks, toast, isMobile]
  );

  const updateBlock = useCallback((id, updates) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...updates } : block)));
  }, []);

  const deleteBlock = useCallback(
    (id) => {
      setUndoStack((prev) => [...prev, blocks]);
      setRedoStack([]);
      setBlocks((prev) => prev.filter((block) => block.id !== id));
      if (selectedBlock === id) {
        setSelectedBlock(null);
        if (isMobile || isTablet) {
          setPropertyPanelOpen(false);
        }
      }

      toast({
        title: "Element Removed",
        description: "The element has been removed from your email.",
        duration: 2000,
      });
    },
    [blocks, selectedBlock, toast, isMobile, isTablet]
  );

  const duplicateBlock = useCallback(
    (id) => {
      const blockToDuplicate = blocks.find((block) => block.id === id);
      if (blockToDuplicate) {
        const maxY = Math.max(...blocks.map((b) => b.position.y), 0);
        const newBlock = {
          ...blockToDuplicate,
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            x: blockToDuplicate.position.x,
            y: maxY + 50, // Place below the last block
          },
        };
        setUndoStack((prev) => [...prev, blocks]);
        setRedoStack([]);
        setBlocks((prev) => [...prev, newBlock]);
        setSelectedBlock(newBlock.id);

        toast({
          title: "Element Copied! 📋",
          description: "A copy of your element has been created.",
          duration: 2000,
        });
      }
    },
    [blocks, toast]
  );

  const moveBlock = useCallback(
    (id, direction) => {
      const currentIndex = blocks.findIndex((block) => block.id === id);
      if (currentIndex === -1) return;

      const newBlocks = [...blocks];
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex >= 0 && targetIndex < blocks.length) {
        // Swap blocks
        [newBlocks[currentIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[currentIndex]];
        // Update positions to maintain order
        newBlocks.forEach((block, index) => {
          block.position.y = index * 100;
        });
        setUndoStack((prev) => [...prev, blocks]);
        setRedoStack([]);
        setBlocks(newBlocks);
      }
    },
    [blocks]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, blocks]);
      setBlocks(previousState);
      setUndoStack((prev) => prev.slice(0, -1));

      toast({
        title: "Undone! ↶",
        description: "Your last change has been undone.",
        duration: 1500,
      });
    }
  }, [undoStack, blocks, toast]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [... ilgili, blocks]);
      setBlocks(nextState);
      setRedoStack((prev) => prev.slice(0, -1));

      toast({
        title: "Redone! ↷",
        description: "Your change has been restored.",
        duration: 1500,
      });
    }
  }, [redoStack, blocks, toast]);

  const handleSave = useCallback(async () => {
    setIsAutoSaving(true);

    try {
      const templateData = {
        name: templateName,
        description: `Email template with ${blocks.length} elements`,
        category: "other",
        blocks: blocks.sort((a, b) => a.position.y - b.position.y), // Ensure blocks are sorted before saving
        styles: {},
        metadata: {
          version: "1.0.0",
          createdBy: null, // Add user ID when authentication is implemented
          tags: [],
          isPublic: false,
        },
        responsive: {
          mobile: {},
          tablet: {},
          desktop: {},
        },
      };

      if (currentTemplateId) {
        await updateTemplate(currentTemplateId, templateData);
      } else {
        const savedTemplate = await createTemplate(templateData);
        setCurrentTemplateId(savedTemplate._id);
      }

      setLastSaved(new Date());

      toast({
        title: "Email Saved! 💾",
        description: "Your email template has been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [templateName, blocks, currentTemplateId, createTemplate, updateTemplate, toast]);

  const handleAutoSave = useCallback(async () => {
    if (currentTemplateId && blocks.length > 0) {
      try {
        const templateData = {
          name: templateName,
          blocks: blocks.sort((a, b) => a.position.y - b.position.y), // Ensure blocks are sorted before auto-saving
          metadata: {
            version: "1.0.0",
            updatedAt: new Date(),
          },
        };

        await updateTemplate(currentTemplateId, templateData);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }
  }, [currentTemplateId, templateName, blocks, updateTemplate]);

  const handleTemplateSelect = useCallback(
    async (template) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Sort blocks by position.y to ensure correct order
      const sortedBlocks = [...template.blocks].sort((a, b) => a.position.y - b.position.y);
      setUndoStack((prev) => [...prev, blocks]);
      setRedoStack([]);
      setBlocks(sortedBlocks);
      setSelectedBlock(null);
      setShowTemplates(false);
      setIsLoading(false);
      setTemplateName(template.name);
      setCurrentTemplateId(template._id);

      toast({
        title: "Template Loaded! 🎨",
        description: `${template.name} is now ready to customize.`,
        duration: 3000,
      });
    },
    [blocks, toast]
  );

  const generateEmailContent = useCallback(() => {
    const emailData = {
      templateName,
      totalElements: blocks.length,
      lastModified: lastSaved || new Date(),
      elements: blocks.map((block) => ({
        type: getBlockDisplayName(block.type),
        content: getBlockSummary(block),
      })),
    };
    return emailData;
  }, [blocks, templateName, lastSaved]);

  const handleBlockSelect = useCallback(
    (id) => {
      setSelectedBlock(id);
      if (id && (isMobile || isTablet)) {
        setPropertyPanelOpen(true);
      }
    },
    [isMobile, isTablet]
  );

  return (
    <TooltipProvider>
      <div className={`h-screen flex flex-col relative overflow-hidden ${darkMode ? "dark" : ""}`}>
        <AnimatedBackground />

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 shadow-lg relative z-10"
        >
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <Sidebar onAddBlock={addBlock} />
                  </SheetContent>
                </Sheet>
              )}
              <motion.div className="flex items-center space-x-2 lg:space-x-4" whileHover={{ scale: 1.02 }}>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Email Designer
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Professional
                    </Badge>
                    {isAutoSaving && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-1 text-xs text-green-600"
                      >
                        <LoadingSpinner size="sm" />
                        <span className="hidden sm:inline">Auto-saving...</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center Section - Template Name */}
            {isDesktop && (
              <div className="flex-1 max-w-md mx-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="text-center font-medium bg-white/80 backdrop-blur-sm border-white/40"
                    placeholder="Name your email template"
                  />
                  <div className="text-xs text-gray-500">{lastSaved && `Saved ${lastSaved.toLocaleTimeString()}`}</div>
                </div>
              </div>
            )}

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              <div className="hidden md:flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-sm space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIAssistant(true)}
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Bot className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI Writing Assistant</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCollaboration(true)}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Users className="w-4 h-4" />
                      {collaborators.length > 0 && (
                        <Badge className="ml-1 h-4 w-4 p-0 text-xs">{collaborators.length}</Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share & Collaborate</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowVersionHistory(true)}
                      className="hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Version History</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUndo}
                      disabled={undoStack.length === 0}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo Last Change</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo Change</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === "desktop" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("desktop")}
                      className="h-8 px-2"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === "tablet" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("tablet")}
                      className="h-8 px-2"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === "mobile" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPreviewMode("mobile")}
                      className="h-8 px-2"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile View</TooltipContent>
                </Tooltip>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(true)}
                    className="relative hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <div className="flex items-center space-x-1">
                {!isMobile && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMarketplace(true)}
                          className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white hover:shadow-md"
                        >
                          <Store className="w-4 h-4 mr-1" />
                          <span className="hidden lg:inline">Browse</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Browse Templates</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTemplates(true)}
                          className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white hover:shadow-md"
                        >
                          <Layout className="w-4 h-4 mr-1" />
                          <span className="hidden lg:inline">Templates</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Choose Template</TooltipContent>
                    </Tooltip>
                  </>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                      className="bg-white/80 backdrop-blur-sm border-white/40 hover:bg-white hover:shadow-md"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Preview Your Email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isAutoSaving}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      {isAutoSaving ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Save</span>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Your Email</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="px-4 pb-3">
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="text-center font-medium bg-white/80 backdrop-blur-sm border-white/40"
                placeholder="Name your email template"
              />
            </div>
          )}
        </motion.header>

        <ResponsiveToolbar
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          gridSnap={gridSnap}
          onGridSnapChange={setGridSnap}
          showRulers={showRulers}
          onShowRulersChange={setShowRulers}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          isMobile={isMobile}
        />

        <div className="flex-1 flex overflow-hidden relative z-10">
          {!isMobile && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`${
                sidebarOpen ? "w-80" : "w-0"
              } transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 shadow-lg overflow-hidden`}
            >
              {sidebarOpen && <Sidebar onAddBlock={addBlock} />}
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col relative"
          >
            <Canvas
              ref={canvasRef}
              blocks={blocks}
              selectedBlock={selectedBlock}
              previewMode={previewMode}
              onSelectBlock={handleBlockSelect}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
              onDuplicateBlock={duplicateBlock}
              onMoveBlock={moveBlock}
              draggedBlock={draggedBlock}
              setDraggedBlock={setDraggedBlock}
              zoomLevel={zoomLevel}
              gridSnap={gridSnap}
              showRulers={showRulers}
              darkMode={darkMode}
            />

            <QuickActions
              onAddBlock={addBlock}
              onShowTemplates={() => setShowTemplates(true)}
              onShowAI={() => setShowAIAssistant(true)}
              isMobile={isMobile}
            />
          </motion.div>

          <AnimatePresence>
            {selectedBlock && (
              <>
                {(isMobile || isTablet) && (
                  <Sheet open={propertyPanelOpen} onOpenChange={setPropertyPanelOpen}>
                    <SheetContent side="right" className="w-full sm:w-96 p-0">
                      <PropertyPanel
                        block={blocks.find((b) => b.id === selectedBlock)}
                        onUpdateBlock={updateBlock}
                        onClose={() => {
                          setSelectedBlock(null);
                          setPropertyPanelOpen(false);
                        }}
                        isMobile={isMobile}
                      />
                    </SheetContent>
                  </Sheet>
                )}
                {isDesktop && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/20 shadow-lg relative"
                  >
                    <PropertyPanel
                      block={blocks.find((b) => b.id === selectedBlock)}
                      onUpdateBlock={updateBlock}
                      onClose={() => setSelectedBlock(null)}
                      isMobile={false}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setShowAdvancedEditor(true)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Style
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Advanced Styling</TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {isMobile && (
          <div className="fixed bottom-6 right-6 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                  <Zap className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh]">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setShowTemplates(true)} className="h-20 flex-col">
                      <Layout className="w-6 h-6 mb-2" />
                      Choose Template
                    </Button>
                    <Button onClick={() => setShowAIAssistant(true)} className="h-20 flex-col">
                      <Bot className="w-6 h-6 mb-2" />
                      AI Assistant
                    </Button>
                    <Button onClick={() => setShowMarketplace(true)} className="h-20 flex-col">
                      <Store className="w-6 h-6 mb-2" />
                      Browse Designs
                    </Button>
                    <Button onClick={() => setShowExport(true)} className="h-20 flex-col">
                      <Download className="w-6 h-6 mb-2" />
                      Download Email
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center"
              >
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading your template...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          blocks={blocks}
          previewMode={previewMode}
          templateName={templateName}
        />
        <ExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          emailData={generateEmailContent()}
          templateName={templateName}
          blocks={blocks}
        />
        <TemplateLibrary
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleTemplateSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <AIAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          onGenerateTemplate={(prompt) => console.log("Generate template:", prompt)}
          onOptimizeContent={(content) => console.log("Optimize content:", content)}
          blocks={blocks}
          onUpdateBlocks={setBlocks}
        />
        <CollaborationPanel
          isOpen={showCollaboration}
          onClose={() => setShowCollaboration(false)}
          collaborators={collaborators}
          onInviteCollaborator={(email) => console.log("Invite:", email)}
        />
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestoreVersion={(version) => console.log("Restore version:", version)}
          currentBlocks={blocks}
        />
        <AnalyticsDashboard
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          templateData={{ name: templateName, blocks, lastSaved }}
        />
        <TemplateMarketplace
          isOpen={showMarketplace}
          onClose={() => setShowMarketplace(false)}
          onPurchaseTemplate={(template) => console.log("Purchase template:", template)}
          onPreviewTemplate={(template) => console.log("Preview template:", template)}
        />
        <AdvancedEditor
          isOpen={showAdvancedEditor}
          onClose={() => setShowAdvancedEditor(false)}
          selectedBlock={blocks.find((b) => b.id === selectedBlock)}
          onUpdateBlock={updateBlock}
          previewMode={previewMode}
        />
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAsRead={(id) => console.log("Mark as read:", id)}
          onClearAll={() => setNotifications([])}
        />
        <PerformanceMonitor
          blockCount={blocks.length}
          isVisible={showPerformance}
          templateSize={JSON.stringify(blocks).length}
          renderTime={0}
        />
      </div>
    </TooltipProvider>
  );
}

// Helper functions (unchanged)
function getBlockDisplayName(type) {
  const displayNames = {
    text: "Text",
    image: "Image",
    button: "Button",
    social: "Social Media",
    divider: "Divider Line",
    spacer: "Space",
    columns: "Columns",
    video: "Video",
    countdown: "Countdown Timer",
    survey: "Survey",
    form: "Contact Form",
    map: "Map",
    chart: "Chart",
    testimonial: "Testimonial",
    pricing: "Pricing Table",
    gallery: "Image Gallery",
    qr: "QR Code",
    calendar: "Calendar Event",
  };
  return displayNames[type] || type;
}

function getBlockSummary(block) {
  switch (block.type) {
    case "text":
      return block.content.text?.substring(0, 50) + "..." || "Text content";
    case "image":
      return `Image: ${block.content.alt || "Untitled"}`;
    case "button":
      return `Button: "${block.content.text}"`;
    case "social":
      return `${block.content.platforms?.length || 0} social platforms`;
    case "countdown":
      return `Countdown: ${block.content.title}`;
    default:
      return `${getBlockDisplayName(block.type)} element`;
  }
}

function getDefaultContent(type) {
  switch (type) {
    case "text":
      return {
        text: "Click here to edit your text...",
        tag: "p",
        formatting: { bold: false, italic: false, underline: false },
      };
    case "image":
      return {
        src: "/placeholder.svg?height=200&width=400",
        alt: "Your image description",
        width: 400,
        height: 200,
      };
    case "button":
      return {
        text: "Click Me",
        href: "https://example.com",
        target: "_blank",
      };
    case "social":
      return {
        platforms: [
          {
            id: "1",
            name: "facebook",
            url: "https://facebook.com/yourpage",
            enabled: true,
            icon: "facebook",
            color: "#1877F2",
            target: "_blank",
          },
          {
            id: "2",
            name: "twitter",
            url: "https://twitter.com/yourhandle",
            enabled: true,
            icon: "twitter",
            color: "#1DA1F2",
            target: "_blank",
          },
          {
            id: "3",
            name: "instagram",
            url: "https://instagram.com/yourprofile",
            enabled: true,
            icon: "instagram",
            color: "#E4405F",
            target: "_blank",
          },
        ],
      };
    case "divider":
      return { style: "solid", thickness: 1, color: "#e5e7eb" };
    case "spacer":
      return { height: 40 };
    case "columns":
      return {
        columns: [
          { content: "Left column content", width: "50%" },
          { content: "Right column content", width: "50%" },
        ],
      };
    case "video":
      return {
        src: "/placeholder.mp4",
        poster: "/placeholder.svg?height=300&width=500",
        width: 500,
        height: 300,
        autoplay: false,
        controls: true,
      };
    case "countdown":
      return {
        title: "Limited Time Offer!",
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        subtitle: "Don't miss out on this amazing deal!",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      };
    case "survey":
      return {
        title: "We'd love your feedback!",
        type: "rating",
        question: "How satisfied are you with our service?",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
      };
    case "form":
      return {
        title: "Get In Touch",
        fields: [
          { type: "text", label: "Your Name", required: true },
          { type: "email", label: "Email Address", required: true },
          { type: "textarea", label: "Your Message", required: false },
        ],
        submitText: "Send Message",
        action: "#",
      };
    case "map":
      return {
        address: "123 Main Street, Your City, State 12345",
        zoom: 15,
        width: 400,
        height: 300,
        showMarker: true,
      };
    case "chart":
      return {
        type: "bar",
        title: "Sample Chart",
        data: [
          { label: "January", value: 100 },
          { label: "February", value: 150 },
          { label: "March", value: 200 },
        ],
        width: 400,
        height: 300,
      };
    case "testimonial":
      return {
        quote: "This is an amazing product! I highly recommend it to everyone.",
        author: "John Smith",
        title: "Happy Customer",
        avatar: "/placeholder.svg?height=60&width=60",
        rating: 5,
      };
    case "pricing":
      return {
        title: "Pro Plan",
        price: "$29",
        period: "month",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        buttonText: "Get Started",
        buttonLink: "https://example.com/signup",
        featured: false,
      };
    case "gallery":
      return {
        images: [
          { src: "/placeholder.svg?height=200&width=200", alt: "Gallery Image 1" },
          { src: "/placeholder.svg?height=200&width=200", alt: "Gallery Image 2" },
          { src: "/placeholder.svg?height=200&width=200", alt: "Gallery Image 3" },
        ],
        columns: 3,
        spacing: 10,
      };
    case "qr":
      return {
        data: "https://yourwebsite.com",
        size: 200,
        errorCorrectionLevel: "M",
        includeMargin: true,
      };
    case "calendar":
      return {
        title: "Upcoming Event",
        date: new Date().toISOString(),
        time: "10:00 AM",
        location: "Conference Room A",
        description: "Join us for an important meeting about project updates",
      };
    default:
      return {};
  }
}

function getDefaultStyles(type) {
  const baseStyles = {
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    margin: { top: 0, right: 0, bottom: 16, left: 0 },
    backgroundColor: "transparent",
    borderRadius: 0,
  };

  switch (type) {
    case "text":
      return {
        ...baseStyles,
        fontSize: 16,
        color: "#333333",
        textAlign: "left",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        fontWeight: "normal",
      };
    case "button":
      return {
        ...baseStyles,
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: 6,
        border: "none",
        display: "inline-block",
        minWidth: 120,
        minHeight: 44,
      };
    case "divider":
      return {
        ...baseStyles,
        borderTop: "1px solid #e5e7eb",
        height: 1,
      };
    case "countdown":
      return {
        ...baseStyles,
        backgroundColor: "#f8fafc",
        timeBoxColor: "#3b82f6",
        timeTextColor: "#ffffff",
        titleColor: "#333333",
        textAlign: "center",
      };
    case "social":
      return {
        ...baseStyles,
        textAlign: "center",
        iconSize: 40,
        iconSpacing: 12,
      };
    default:
      return baseStyles;
  }
}

function getResponsiveStyles(type, device) {
  const baseResponsive = {
    mobile: {
      padding: { top: 12, right: 12, bottom: 12, left: 12 },
      margin: { top: 0, right: 0, bottom: 12, left: 0 },
    },
    tablet: {
      padding: { top: 14, right: 14, bottom: 14, left: 14 },
      margin: { top: 0, right: 0, bottom: 14, left: 0 },
    },
    desktop: {
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      margin: { top: 0, right: 0, bottom: 16, left: 0 },
    },
  };

  switch (type) {
    case "text":
      return {
        ...baseResponsive[device],
        fontSize: device === "mobile" ? 14 : device === "tablet" ? 15 : 16,
        lineHeight: device === "mobile" ? 1.4 : 1.5,
      };
    case "button":
      return {
        ...baseResponsive[device],
        fontSize: device === "mobile" ? 14 : 16,
        minHeight: device === "mobile" ? 40 : 44,
        minWidth: device === "mobile" ? 100 : 120,
      };
    case "social":
      return {
        ...baseResponsive[device],
        iconSize: device === "mobile" ? 32 : device === "tablet" ? 36 : 40,
        iconSpacing: device === "mobile" ? 8 : device === "tablet" ? 10 : 12,
      };
    default:
      return baseResponsive[device];
  }
}