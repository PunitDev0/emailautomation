"use client"

import { useState, useEffect, useCallback } from "react"
import { templateService } from "@/lib/services/template-service"
import { toast } from "sonner"

export function useTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  })


  const fetchTemplates = useCallback(
    async (params = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await templateService.getTemplates(params)
        setTemplates(response.data.templates)
        setPagination(response.data.pagination)
      } catch (err) {
        setError(err.message)
        toast({
          title: "Error Loading Templates",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const createTemplate = useCallback(
    async (templateData) => {
      setLoading(true)

      try {
        const response = await templateService.createTemplate(templateData)

        toast({
          title: "Template Saved! ✨",
          description: `"${templateData.name}" has been saved successfully.`,
        })

        // Refresh templates list
        await fetchTemplates()

        return response.data
      } catch (err) {
        toast({
          title: "Save Failed",
          description: err.message,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchTemplates, toast],
  )

  const updateTemplate = useCallback(
    async (id, templateData) => {
      setLoading(true)

      try {
        const response = await templateService.updateTemplate(id, templateData)

        toast({
          title: "Template Updated! ✅",
          description: "Your changes have been saved.",
        })

        // Update local state
        setTemplates((prev) =>
          prev.map((template) => (template._id === id ? { ...template, ...templateData } : template)),
        )

        return response.data
      } catch (err) {
        toast({
          title: "Update Failed",
          description: err.message,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const deleteTemplate = useCallback(
    async (id) => {
      setLoading(true)

      try {
        await templateService.deleteTemplate(id)

        toast({
          title: "Template Deleted",
          description: "The template has been removed.",
        })

        // Remove from local state
        setTemplates((prev) => prev.filter((template) => template._id !== id))
      } catch (err) {
        toast({
          title: "Delete Failed",
          description: err.message,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const duplicateTemplate = useCallback(
    async (id, newName) => {
      setLoading(true)

      try {
        const response = await templateService.duplicateTemplate(id, newName)

        toast({
          title: "Template Copied! 📋",
          description: "A copy of your template has been created.",
        })

        // Refresh templates list
        await fetchTemplates()

        return response.data
      } catch (err) {
        toast({
          title: "Copy Failed",
          description: err.message,
          variant: "destructive",
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchTemplates, toast],
  )

  return {
    templates,
    loading,
    error,
    pagination,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
  }
}

export function useTemplate(id) {
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)



  const fetchTemplate = useCallback(
    async (templateId) => {
      setLoading(true)
      setError(null)

      try {
        const response = await templateService.getTemplate(templateId)
        setTemplate(response.data)
      } catch (err) {
        setError(err.message)
        toast({
          title: "Error Loading Template",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    if (id) {
      fetchTemplate(id)
    }
  }, [id, fetchTemplate])

  return {
    template,
    loading,
    error,
    fetchTemplate,
    refetch: () => id && fetchTemplate(id),
  }
}
