// app/api/items/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const items = await prisma.item.findMany({
      include: {
        withholding_taxes: true,
        invoice: {
          select: {
            reference_code: true
          }
        }
      }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error al obtener items:", error);
    return NextResponse.json(
      { error: "Error al obtener items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();

    // Validación de campos requeridos
    const requiredFields = [
      'code_reference',
      'name',
      'quantity',
      'price',
      'tax_rate',
      'unit_measure_id',
      'standard_code_id',
      'tribute_id',
      'invoiceId'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Faltan campos requeridos: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        code_reference: data.code_reference,
        name: data.name,
        quantity: data.quantity,
        discount_rate: data.discount_rate || 0,
        price: data.price,
        tax_rate: data.tax_rate,
        unit_measure_id: data.unit_measure_id,
        standard_code_id: data.standard_code_id,
        is_excluded: data.is_excluded || 0,
        tribute_id: data.tribute_id,
        invoiceId: data.invoiceId,
        withholding_taxes: {
          create: data.withholding_taxes || []
        }
      },
      include: {
        withholding_taxes: true
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error al crear item:", error);
    return NextResponse.json(
      { error: "Error al crear item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "ID del item requerido" },
        { status: 400 }
      );
    }

    // Actualizar item y sus retenciones
    const item = await prisma.item.update({
      where: { id: data.id },
      data: {
        code_reference: data.code_reference,
        name: data.name,
        quantity: data.quantity,
        discount_rate: data.discount_rate,
        price: data.price,
        tax_rate: data.tax_rate,
        unit_measure_id: data.unit_measure_id,
        standard_code_id: data.standard_code_id,
        is_excluded: data.is_excluded,
        tribute_id: data.tribute_id,
        withholding_taxes: {
          deleteMany: {}, // Elimina las retenciones existentes
          create: data.withholding_taxes || [] // Crea las nuevas retenciones
        }
      },
      include: {
        withholding_taxes: true
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error al actualizar item:", error);
    return NextResponse.json(
      { error: "Error al actualizar item" },
      { status: 500 }
    );
  }
}