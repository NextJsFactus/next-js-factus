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

    const customer = await prisma.customer.findUnique({
      where: { id: Number(params.id) },
      include: {
        invoices: {
          select: {
            id: true,
            reference_code: true,
            payment_due_date: true,
            // Agrega otros campos que necesites
          },
          orderBy: {
            id: 'desc'
          },
          take: 5 // Límite de las últimas 5 facturas
        }
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}

// Opcional: Endpoint para eliminar cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar si el cliente tiene facturas asociadas
    const customer = await prisma.customer.findUnique({
      where: { id: Number(params.id) },
      include: {
        _count: {
          select: { invoices: true }
        }
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    if (customer._count.invoices > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar el cliente porque tiene facturas asociadas" },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}