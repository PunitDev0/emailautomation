import { NextResponse } from "next/server"
import { connectToDatabase } from '@/DB/db';
import Template from "@/lib/models/template"
import mongoose from "mongoose"

// GET /api/templates/[id] - Get single template
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid template ID" }, { status: 400 })
    }

    const template = await Template.findById(id)

    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

    // Increment usage count
    await template.incrementUsage()

    return NextResponse.json({
      success: true,
      data: template,
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

// PUT /api/templates/[id] - Update template
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid template ID" }, { status: 400 })
    }

    const template = await Template.findById(id)

    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

    // Update fields
    const allowedUpdates = ["name", "description", "category", "blocks", "styles", "responsive", "metadata"]
    const updates = {}

    allowedUpdates.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === "metadata") {
          updates.metadata = { ...template.metadata, ...body.metadata }
        } else {
          updates[field] = body[field]
        }
      }
    })

    const updatedTemplate = await Template.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
      message: "Template updated successfully",
    })
  } catch (error) {
    console.error(`PUT /api/templates/${params.id} error:`, error)

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
        error: "Failed to update template",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// DELETE /api/templates/[id] - Delete template
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid template ID" }, { status: 400 })
    }

    const template = await Template.findByIdAndDelete(id)

    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }

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
