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
        .select("-blocks") // Exclude blocks for list view to reduce payload
        .sort({ "metadata.createdAt": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Template.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: {
        templates,
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

// POST /api/templates - Create new template
export async function POST(request) {
  try {
    await connectToDatabase ()

    const body = await request.json()
    const { name, description, category, blocks, styles, metadata, responsive } = body

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Template name is required" }, { status: 400 })
    }

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ success: false, error: "Template blocks are required" }, { status: 400 })
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
      description: description?.trim(),
      category: category || "other",
      blocks,
      styles: styles || {},
      metadata: {
        version: "1.0.0",
        createdBy: metadata?.createdBy || null,
        tags: metadata?.tags || [],
        isPublic: metadata?.isPublic || false,
        usageCount: 0,
      },
      responsive: responsive || { mobile: {}, tablet: {}, desktop: {} },
    })

    const savedTemplate = await template.save()

    return NextResponse.json(
      {
        success: true,
        data: savedTemplate,
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
