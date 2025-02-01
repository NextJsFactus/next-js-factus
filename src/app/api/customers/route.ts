import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET - Obtener todos los clientes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { identification: { contains: search } },
          { names: { contains: search } },
          { company: { contains: search } },
          { email: { contains: search } }
        ]
      };
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { invoices: true }
        }
      }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo cliente
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();

    // Validación de campos requeridos
    const requiredFields = [
      'identification',
      'dv',
      'names',
      'address',
      'email',
      'phone',
      'legal_organization_id',
      'tribute_id',
      'identification_document_id',
      'municipality_id'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Faltan campos requeridos: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Verificar si ya existe un cliente con la misma identificación
    const existingCustomer = await prisma.customer.findFirst({
      where: { identification: data.identification }
    });

    if (existingCustomer) {
      return NextResponse.json({
        error: "Ya existe un cliente con esta identificación"
      }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        identification: data.identification,
        dv: data.dv,
        company: data.company,
        trade_name: data.trade_name,
        names: data.names,
        address: data.address,
        email: data.email,
        phone: data.phone,
        legal_organization_id: data.legal_organization_id,
        tribute_id: data.tribute_id,
        identification_document_id: data.identification_document_id,
        municipality_id: data.municipality_id
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cliente
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "ID de cliente requerido" },
        { status: 400 }
      );
    }

    // Verificar si existe el cliente
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: data.id }
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const customer = await prisma.customer.update({
      where: { id: data.id },
      data: {
        identification: data.identification,
        dv: data.dv,
        company: data.company,
        trade_name: data.trade_name,
        names: data.names,
        address: data.address,
        email: data.email,
        phone: data.phone,
        legal_organization_id: data.legal_organization_id,
        tribute_id: data.tribute_id,
        identification_document_id: data.identification_document_id,
        municipality_id: data.municipality_id
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}