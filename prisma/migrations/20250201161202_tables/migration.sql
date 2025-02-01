-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "urllogo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumberingRange" (
    "id" SERIAL NOT NULL,
    "numbering_range" INTEGER NOT NULL,

    CONSTRAINT "NumberingRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "numbering_range_id" INTEGER NOT NULL,
    "reference_code" TEXT NOT NULL,
    "observation" TEXT,
    "payment_form" TEXT NOT NULL,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "payment_method_code" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingPeriod" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "end_time" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "BillingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "identification" TEXT NOT NULL,
    "dv" TEXT NOT NULL,
    "company" TEXT,
    "trade_name" TEXT,
    "names" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "legal_organization_id" TEXT NOT NULL,
    "tribute_id" TEXT NOT NULL,
    "identification_document_id" TEXT NOT NULL,
    "municipality_id" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "code_reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount_rate" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tax_rate" TEXT NOT NULL,
    "unit_measure_id" INTEGER NOT NULL,
    "standard_code_id" INTEGER NOT NULL,
    "is_excluded" INTEGER NOT NULL,
    "tribute_id" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithholdingTax" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "withholding_tax_rate" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "WithholdingTax_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BillingPeriod_invoiceId_key" ON "BillingPeriod"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_invoiceId_key" ON "Customer"("invoiceId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_numbering_range_id_fkey" FOREIGN KEY ("numbering_range_id") REFERENCES "NumberingRange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingPeriod" ADD CONSTRAINT "BillingPeriod_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithholdingTax" ADD CONSTRAINT "WithholdingTax_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
