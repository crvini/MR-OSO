// ==========================================
// Mr Oso Company — Datos Mock para Demo
// ==========================================

export const empleados = [
  { id: 1, nombre: 'Carlos Méndez', rol: 'Lavador Senior', activo: true },
  { id: 2, nombre: 'Luis Hernández', rol: 'Lavador', activo: true },
  { id: 3, nombre: 'Pedro Ramírez', rol: 'Lavador', activo: true },
  { id: 4, nombre: 'Ana García', rol: 'Cajera', activo: true },
  { id: 5, nombre: 'Roberto López', rol: 'Detailer', activo: true },
];

export const servicios = [
  {
    id: 1,
    nombre: 'Lavado Básico',
    precio: 35.00,
    duracion: 20,
    descripcion: 'Lavado exterior con agua a presión, jabón especial y secado.',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Lavado Completo',
    precio: 65.00,
    duracion: 35,
    descripcion: 'Lavado exterior e interior, aspirado, limpieza de tablero y vidrios.',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Lavado Premium',
    precio: 120.00,
    duracion: 50,
    descripcion: 'Lavado completo + tratamiento de llantas, aromatizante premium y protector de tablero.',
    activo: true,
  },
  {
    id: 4,
    nombre: 'Detailing Interior',
    precio: 200.00,
    duracion: 90,
    descripcion: 'Limpieza profunda de tapicería, alfombras, cielo, consola y todos los compartimentos.',
    activo: true,
  },
  {
    id: 5,
    nombre: 'Detailing Exterior',
    precio: 180.00,
    duracion: 75,
    descripcion: 'Descontaminación de pintura, pulido, corrección de swirls y sellador cerámico.',
    activo: true,
  },
  {
    id: 6,
    nombre: 'Encerado',
    precio: 85.00,
    duracion: 40,
    descripcion: 'Aplicación de cera carnauba de alta calidad con protección UV.',
    activo: true,
  },
  {
    id: 7,
    nombre: 'Lavado de Motor',
    precio: 150.00,
    duracion: 45,
    descripcion: 'Desengrase y limpieza profunda del compartimento del motor con productos especializados.',
    activo: false,
  },
  {
    id: 8,
    nombre: 'Paquete VIP (Todo incluido)',
    precio: 450.00,
    duracion: 180,
    descripcion: 'Incluye todos los servicios: lavado premium, detailing interior y exterior, encerado y lavado de motor.',
    activo: true,
  },
];

export const clientes = [
  {
    id: 1,
    nombre: 'Cristopher De León',
    telefono: '5555-1234',
    email: 'cristopher.deleon@gmail.com',
    vehiculos: [
      { placa: 'P-245-KBR', marca: 'Toyota', modelo: 'Hilux', color: 'Blanco', anio: 2023 },
      { placa: 'P-891-DFG', marca: 'Mazda', modelo: 'CX-5', color: 'Rojo', anio: 2022 },
    ],
    ultimaVisita: '2026-02-27',
    totalVisitas: 45,
  },
  {
    id: 2,
    nombre: 'María Fernanda López',
    telefono: '4212-8876',
    email: 'mflopez@hotmail.com',
    vehiculos: [
      { placa: 'P-112-MFL', marca: 'Honda', modelo: 'CR-V', color: 'Gris', anio: 2024 },
    ],
    ultimaVisita: '2026-02-26',
    totalVisitas: 23,
  },
  {
    id: 3,
    nombre: 'José Roberto Castillo',
    telefono: '3344-5567',
    email: 'jrcastillo@yahoo.com',
    vehiculos: [
      { placa: 'M-456-JRC', marca: 'Nissan', modelo: 'Frontier', color: 'Negro', anio: 2021 },
    ],
    ultimaVisita: '2026-02-25',
    totalVisitas: 12,
  },
  {
    id: 4,
    nombre: 'Ana Lucía Morales',
    telefono: '5590-3321',
    email: 'analucia.m@gmail.com',
    vehiculos: [
      { placa: 'P-789-ALM', marca: 'Kia', modelo: 'Sportage', color: 'Azul', anio: 2023 },
      { placa: 'P-334-ALM', marca: 'Suzuki', modelo: 'Swift', color: 'Blanco', anio: 2020 },
    ],
    ultimaVisita: '2026-02-27',
    totalVisitas: 31,
  },
  {
    id: 5,
    nombre: 'Carlos Eduardo Pérez',
    telefono: '4478-9912',
    email: 'ceperez@outlook.com',
    vehiculos: [
      { placa: 'P-567-CEP', marca: 'Hyundai', modelo: 'Tucson', color: 'Plata', anio: 2022 },
    ],
    ultimaVisita: '2026-02-24',
    totalVisitas: 8,
  },
  {
    id: 6,
    nombre: 'Sofía Alejandra Ruiz',
    telefono: '3012-4456',
    email: 'sofia.ruiz@gmail.com',
    vehiculos: [
      { placa: 'P-901-SAR', marca: 'Toyota', modelo: 'RAV4', color: 'Verde', anio: 2024 },
    ],
    ultimaVisita: '2026-02-23',
    totalVisitas: 15,
  },
  {
    id: 7,
    nombre: 'Diego Alejandro Vásquez',
    telefono: '5534-2211',
    email: 'dvasquez@gmail.com',
    vehiculos: [
      { placa: 'M-223-DAV', marca: 'Mitsubishi', modelo: 'L200', color: 'Gris', anio: 2021 },
      { placa: 'P-678-DAV', marca: 'BMW', modelo: 'X3', color: 'Negro', anio: 2023 },
    ],
    ultimaVisita: '2026-02-27',
    totalVisitas: 38,
  },
  {
    id: 8,
    nombre: 'Gabriela Estrada Monzón',
    telefono: '4190-7788',
    email: 'gestrada@hotmail.com',
    vehiculos: [
      { placa: 'P-345-GEM', marca: 'Chevrolet', modelo: 'Tracker', color: 'Rojo', anio: 2025 },
    ],
    ultimaVisita: '2026-02-22',
    totalVisitas: 5,
  },
];

export const turnosIniciales = [
  {
    id: 1,
    placa: 'P-245-KBR',
    marca: 'Toyota',
    modelo: 'Hilux',
    color: 'Blanco',
    cliente: 'Cristopher De León',
    servicio: 'Lavado Premium',
    empleado: 'Carlos Méndez',
    horaIngreso: '08:15',
    estado: 'recibido',
  },
  {
    id: 2,
    placa: 'P-112-MFL',
    marca: 'Honda',
    modelo: 'CR-V',
    color: 'Gris',
    cliente: 'María Fernanda López',
    servicio: 'Lavado Completo',
    empleado: 'Luis Hernández',
    horaIngreso: '08:30',
    estado: 'recibido',
  },
  {
    id: 3,
    placa: 'P-789-ALM',
    marca: 'Kia',
    modelo: 'Sportage',
    color: 'Azul',
    cliente: 'Ana Lucía Morales',
    servicio: 'Paquete VIP (Todo incluido)',
    empleado: 'Roberto López',
    horaIngreso: '07:45',
    estado: 'en_proceso',
  },
  {
    id: 4,
    placa: 'M-223-DAV',
    marca: 'Mitsubishi',
    modelo: 'L200',
    color: 'Gris',
    cliente: 'Diego Alejandro Vásquez',
    servicio: 'Detailing Interior',
    empleado: 'Carlos Méndez',
    horaIngreso: '07:30',
    estado: 'en_proceso',
  },
  {
    id: 5,
    placa: 'P-567-CEP',
    marca: 'Hyundai',
    modelo: 'Tucson',
    color: 'Plata',
    cliente: 'Carlos Eduardo Pérez',
    servicio: 'Lavado Básico',
    empleado: 'Pedro Ramírez',
    horaIngreso: '07:00',
    estado: 'listo',
  },
  {
    id: 6,
    placa: 'P-901-SAR',
    marca: 'Toyota',
    modelo: 'RAV4',
    color: 'Verde',
    cliente: 'Sofía Alejandra Ruiz',
    servicio: 'Encerado',
    empleado: 'Luis Hernández',
    horaIngreso: '06:45',
    estado: 'entregado',
  },
  {
    id: 7,
    placa: 'P-345-GEM',
    marca: 'Chevrolet',
    modelo: 'Tracker',
    color: 'Rojo',
    cliente: 'Gabriela Estrada Monzón',
    servicio: 'Lavado Completo',
    empleado: 'Pedro Ramírez',
    horaIngreso: '09:00',
    estado: 'recibido',
  },
  {
    id: 8,
    placa: 'P-678-DAV',
    marca: 'BMW',
    modelo: 'X3',
    color: 'Negro',
    cliente: 'Diego Alejandro Vásquez',
    servicio: 'Detailing Exterior',
    empleado: 'Roberto López',
    horaIngreso: '06:30',
    estado: 'entregado',
  },
];

export const ultimosServicios = [
  { id: 1, placa: 'P-901-SAR', servicio: 'Encerado', estado: 'Completado', monto: 85.00 },
  { id: 2, placa: 'P-678-DAV', servicio: 'Detailing Exterior', estado: 'Completado', monto: 180.00 },
  { id: 3, placa: 'P-567-CEP', servicio: 'Lavado Básico', estado: 'Listo', monto: 35.00 },
  { id: 4, placa: 'M-223-DAV', servicio: 'Detailing Interior', estado: 'En Proceso', monto: 200.00 },
  { id: 5, placa: 'P-789-ALM', servicio: 'Paquete VIP', estado: 'En Proceso', monto: 450.00 },
];

export const ingresosSemana = [
  { dia: 'Lun', ingresos: 2850 },
  { dia: 'Mar', ingresos: 3200 },
  { dia: 'Mié', ingresos: 2400 },
  { dia: 'Jue', ingresos: 3750 },
  { dia: 'Vie', ingresos: 4100 },
  { dia: 'Sáb', ingresos: 5200 },
  { dia: 'Dom', ingresos: 3450 },
];

export const historialCliente = [
  { fecha: '2026-02-27', servicio: 'Lavado Premium', monto: 120.00 },
  { fecha: '2026-02-20', servicio: 'Lavado Completo', monto: 65.00 },
  { fecha: '2026-02-13', servicio: 'Encerado', monto: 85.00 },
  { fecha: '2026-02-05', servicio: 'Lavado Premium', monto: 120.00 },
  { fecha: '2026-01-28', servicio: 'Detailing Interior', monto: 200.00 },
  { fecha: '2026-01-15', servicio: 'Paquete VIP (Todo incluido)', monto: 450.00 },
];

export const transaccionesHoy = [
  { id: 1, hora: '07:15', placa: 'P-678-DAV', servicio: 'Detailing Exterior', metodo: 'Tarjeta', monto: 180.00 },
  { id: 2, hora: '07:45', placa: 'P-901-SAR', servicio: 'Encerado', metodo: 'Efectivo', monto: 85.00 },
  { id: 3, hora: '08:00', placa: 'P-334-ALM', servicio: 'Lavado Básico', metodo: 'Efectivo', monto: 35.00 },
  { id: 4, hora: '08:20', placa: 'M-456-JRC', servicio: 'Lavado Completo', metodo: 'Tarjeta', monto: 65.00 },
  { id: 5, hora: '08:45', placa: 'P-891-DFG', servicio: 'Lavado Premium', metodo: 'Efectivo', monto: 120.00 },
];

export const placasDisponibles = [
  'P-245-KBR', 'P-891-DFG', 'P-112-MFL', 'M-456-JRC',
  'P-789-ALM', 'P-334-ALM', 'P-567-CEP', 'P-901-SAR',
  'M-223-DAV', 'P-678-DAV', 'P-345-GEM',
];
