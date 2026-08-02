-- CreateTable
CREATE TABLE "Airport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carrierId" INTEGER NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "originId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "departureAt" DATETIME NOT NULL,
    "arrivalAt" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "priceCents" INTEGER NOT NULL,
    "co2Kg" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Flight_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "confirmationCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "seatPreference" TEXT NOT NULL,
    "travelerCount" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BookingLeg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" TEXT NOT NULL,
    "flightId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    CONSTRAINT "BookingLeg_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookingLeg_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_code_key" ON "Carrier"("code");

-- CreateIndex
CREATE INDEX "Flight_originId_destinationId_departureAt_idx" ON "Flight"("originId", "destinationId", "departureAt");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_carrierId_flightNumber_departureAt_key" ON "Flight"("carrierId", "flightNumber", "departureAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_confirmationCode_key" ON "Booking"("confirmationCode");

-- CreateIndex
CREATE INDEX "Booking_confirmationCode_email_idx" ON "Booking"("confirmationCode", "email");

-- CreateIndex
CREATE INDEX "BookingLeg_flightId_idx" ON "BookingLeg"("flightId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingLeg_bookingId_direction_key" ON "BookingLeg"("bookingId", "direction");
