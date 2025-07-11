import { NextResponse } from "next/server"
import { connectToDatabase } from '@/DB/db';
import Template from "@/lib/models/template";

// GET /api/templates/:id - Get a single template by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase()

    const { id } = params

    const template = await Template.findById(id).lean()

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      )
    }

    // Convert Date fields to ISO strings
    const responseTemplate = {
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
    }

    return NextResponse.json({
      success: true,
      data: responseTemplate,
    })
  } catch (error) {
    console.error(`GET /api/templates/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch template",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// DELETE /api/templates/:id - Delete a template by ID
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase()

    const { id } = params

    const template = await Template.findById(id)

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      )
    }

    // Optional: Add authorization check (e.g., only owner can delete)
    // if (template.metadata.createdBy !== userId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    // }

    await Template.deleteOne({ _id: id })

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    })
  } catch (error) {
    console.error(`DELETE /api/templates/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete template",
        details: error.message,
      },
      { status: 500 },
    )
  }
}