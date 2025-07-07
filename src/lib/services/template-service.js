class TemplateService {
    constructor() {
      this.baseUrl = "/api/tempelates"
    }
  
    async getTemplates(params = {}) {
      const searchParams = new URLSearchParams()
  
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
  
      const response = await fetch(`${this.baseUrl}?${searchParams}`)
  
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`)
      }
  
      return response.json()
    }
  
    async getTemplate(id) {
      const response = await fetch(`${this.baseUrl}/${id}`)
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch template")
      }
  
      return response.json()
    }
  
    async createTemplate(templateData) {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to create template")
      }
  
      return result
    }
  
    async updateTemplate(id, templateData) {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to update template")
      }
  
      return result
    }
  
    async deleteTemplate(id) {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete template")
      }
  
      return result
    }
  
    async duplicateTemplate(id, newName) {
      const template = await this.getTemplate(id)
  
      const duplicatedTemplate = {
        ...template.data,
        name: newName || `${template.data.name} (Copy)`,
        metadata: {
          ...template.data.metadata,
          usageCount: 0,
          isPublic: false,
        },
      }
  
      delete duplicatedTemplate._id
  
      return this.createTemplate(duplicatedTemplate)
    }
  }
  
  export const templateService = new TemplateService()
  