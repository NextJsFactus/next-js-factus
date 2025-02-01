// app/api/items/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const item = await prisma.item.findUnique({
      where: { id: Number(params.id) },
      include: {
        withholding_taxes: true,
        invoice: {
          select: {
            reference_code: true,
            payment_due_date: true
          }
        }
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error al obtener item:", error);
    return NextResponse.json(
      { error: "Error al obtener item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Primero eliminar las retenciones asociadas
    await prisma.withholdingTax.deleteMany({
      where: { itemId: Number(params.id) }
    });

    // Luego eliminar el item
    await prisma.item.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json({ message: "Item eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar item:", error);
    return NextResponse.json(
      { error: "Error al eliminar item" },
      { status: 500 }
    );
  }
}