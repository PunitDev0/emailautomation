import { NextResponse } from "next/server"
import { connectToDatabase } from '@/DB/db';
import Template from "@/lib/models/template";

// GET /api/templates - Get all templates with filtering and pagination
export async function GET(request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const isPublic = searchParams.get("public")
    const createdBy = searchParams.get("createdBy")

    // Build query
    const query = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "metadata.tags": { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (isPublic !== null) {
      query["metadata.isPublic"] = isPublic === "true"
    }

    if (createdBy) {
      query["metadata.createdBy"] = createdBy
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query with pagination
    const [templates, total] = await Promise.all([
      Template.find(query)
        .select("name description category thumbnail metadata")
        .sort({ "metadata.createdAt": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Template.countDocuments(query),
    ])

    // Convert Date fields to ISO strings
    const formattedTemplates = templates.map((template) => ({
      ...template,
      id: template._id.toString(),
      tags: template.metadata.tags,
      downloads: template.metadata.usageCount,
      rating: template.metadata.rating,
      isPremium: template.metadata.isPremium,
      metadata: {
        ...template.metadata,
        createdAt: template.metadata.createdAt.toISOString(),
        updatedAt: template.metadata.updatedAt.toISOString(),
      },
    }))

    return NextResponse.json({
      success: true,
      data: {
        templates: formattedTemplates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("GET /api/templates error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch templates",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// GET /api/templates/categories - Get category counts
export async function GET_CATEGORIES(request) {
  try {
    await connectToDatabase()

    const categories = [
      "all",
      "welcome",
      "promotional",
      "transactional",
      "newsletter",
      "abandoned-cart",
      "business",
      "event",
      "announcement",
      "personal",
      "other",
    ]

    const counts = await Promise.all(
      categories.map(async (category) => {
        const query = category === "all" ? { "metadata.isPublic": true } : { category, "metadata.isPublic": true }
        const count = await Template.countDocuments(query)
        return { id: category, name: category === "all" ? "All Templates" : category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "), count }
      })
    )

    return NextResponse.json({
      success: true,
      data: counts,
    })
  } catch (error) {
    console.error("GET /api/templates/categories error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category counts",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// POST /api/templates - Create new template
export async function POST(request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, description, category, thumbnail, blocks, styles, metadata, responsive } = body

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Template name is required" }, { status: 400 })
    }

    if (!category || !["business", "newsletter", "promotional", "event", "announcement", "personal", "other", "welcome", "transactional", "abandoned-cart"].includes(category)) {
      return NextResponse.json({ success: false, error: "Valid category is required" }, { status: 400 })
    }

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ success: false, error: "Template blocks are required" }, { status: 400 })
    }

    // Validate block types
    const validBlockTypes = [
      "text", "image", "button", "social", "divider", "spacer", "columns",
      "video", "countdown", "survey", "form", "map", "chart", "testimonial",
      "pricing", "gallery", "qr", "calendar"
    ];
    for (const block of blocks) {
      if (!block.id || !block.type || !validBlockTypes.includes(block.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid block type: ${block.type}` },
          { status: 400 }
        );
      }
    }

    // Check if template name already exists for this user
    const existingTemplate = await Template.findOne({
      name: name.trim(),
      "metadata.createdBy": metadata?.createdBy || null,
    })

    if (existingTemplate) {
      return NextResponse.json({ success: false, error: "Template name already exists" }, { status: 409 })
    }

    // Create new template
    const template = new Template({
      name: name.trim(),
      description: description?.trim() || "",
      category,
      thumbnail: thumbnail || null,
      blocks,
      styles: styles || {},
      responsive: responsive || { mobile: {}, tablet: {}, desktop: {} },
      metadata: {
        version: metadata?.version || "1.0.0",
        createdBy: metadata?.createdBy || null,
        tags: metadata?.tags || [],
        isPublic: metadata?.isPublic || false,
        isPremium: metadata?.isPremium || false,
        usageCount: metadata?.usageCount || 0,
        rating: metadata?.rating || 0,
        createdAt: new Date(),
        updatedAt: metadata?.lastSaved ? new Date(metadata.lastSaved) : new Date(),
      },
    })

    const savedTemplate = await template.save()

    // Convert Date fields to ISO strings
    const responseTemplate = {
      ...savedTemplate.toObject(),
      id: savedTemplate._id.toString(),
      tags: savedTemplate.metadata.tags,
      downloads: savedTemplate.metadata.usageCount,
      rating: savedTemplate.metadata.rating,
      isPremium: savedTemplate.metadata.isPremium,
      metadata: {
        ...savedTemplate.metadata,
        createdAt: savedTemplate.metadata.createdAt.toISOString(),
        updatedAt: savedTemplate.metadata.updatedAt.toISOString(),
      },
    }

    return NextResponse.json(
      {
        success: true,
        data: responseTemplate,
        message: "Template created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/templates error:", error)

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: Object.values(error.errors).map((e) => e.message),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create template",
        details: error.message,
      },
      { status: 500 },
    )
  }
}