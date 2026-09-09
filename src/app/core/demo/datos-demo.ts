/**
 * Datos del modo escaparate.
 *
 * La aplicación publicada no tiene back-end detrás: estos datos, tomados del
 * sistema real para que coincidan con la documentación, permiten recorrer todas
 * las pantallas con contenido y llevarlas a Figma. No son datos de personas
 * reales: los nombres y documentos son de un juego de demostración.
 */
import { Agencia, AvisoCliente, Envio, Resumen, Tarifario, Tracking, Usuario } from '../models/modelos';

export const ENVIOS_DEMO: Envio[] = [
  {
    "codigoRastreo": "RE-2026-000017",
    "codigoVerificacion": "TVAT",
    "estadoActual": "LISTO_PARA_RECOJO",
    "remitente": {
      "nombres": "Marisol Quintana Ibarra",
      "dni": "41229900",
      "telefono": "983776655"
    },
    "destinatario": {
      "nombres": "Carlos Núñez Bravo",
      "dni": "40556677",
      "telefono": "960221144"
    },
    "autorizados": [
      {
        "nombres": "Marco Núñez Bravo",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Repuestos de motocicleta",
      "pesoKg": 6,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 20,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 4.0,
      "pesoFacturable": 6.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 26.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-09T09:12:26.25",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-09T09:12:26.292",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-09T09:12:26.314",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-09T09:12:26.327",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-09T09:12:26.339",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      }
    ],
    "fechaRegistro": "2026-09-09T09:12:26.249"
  },
  {
    "codigoRastreo": "RE-2026-000016",
    "codigoVerificacion": "MHMH",
    "estadoActual": "REGISTRADO",
    "remitente": {
      "nombres": "Jorge Ramos Peña",
      "dni": "45871236",
      "telefono": "987654321"
    },
    "destinatario": {
      "nombres": "Luisa Quispe Mena",
      "dni": "70125489",
      "telefono": "964112233"
    },
    "autorizados": [
      {
        "nombres": "Marco Quispe Mena",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Caja de repuestos de motor",
      "pesoKg": 12.5,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 5.0,
      "pesoFacturable": 12.5,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 45.5,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:16:21.44",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      }
    ],
    "fechaRegistro": "2026-09-06T01:16:21.44"
  },
  {
    "codigoRastreo": "RE-2026-000015",
    "codigoVerificacion": "Z7EX",
    "estadoActual": "ENTREGADO",
    "remitente": {
      "nombres": "Marisol Quintana Ibarra",
      "dni": "41229900",
      "telefono": "983776655"
    },
    "destinatario": {
      "nombres": "Carlos Núñez Bravo",
      "dni": "40556677",
      "telefono": "960221144"
    },
    "autorizados": [
      {
        "nombres": "Marco Núñez Bravo",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Repuestos de motocicleta",
      "pesoKg": 6,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 20,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 4.0,
      "pesoFacturable": 6.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 26.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:15:29.85",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:15:29.861",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:15:29.873",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:15:29.88",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:15:29.891",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:15:46.386",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Se generó una nueva clave de seguridad a pedido del cliente"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:17:08.698",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Marco Núñez Bravo (DNI 44556677, autorizado), clave de seguridad verificada"
      }
    ],
    "entrega": {
      "receptorNombres": "Marco Núñez Bravo",
      "receptorDni": "44556677",
      "parentesco": "Autorizado",
      "relacion": "AUTORIZADO",
      "claveVerificada": true,
      "fechaEntrega": "2026-09-06T01:17:08.698",
      "usuario": "almacen.huancayo"
    },
    "fechaRegistro": "2026-09-06T01:15:29.85"
  },
  {
    "codigoRastreo": "RE-2026-000014",
    "codigoVerificacion": "NM5P",
    "estadoActual": "REGISTRADO",
    "remitente": {
      "nombres": "Jorge Ramos Peña",
      "dni": "45871236",
      "telefono": "987654321"
    },
    "destinatario": {
      "nombres": "Luisa Quispe Mena",
      "dni": "70125489",
      "telefono": "964112233"
    },
    "autorizados": [
      {
        "nombres": "Marco Quispe Mena",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Caja de repuestos de motor",
      "pesoKg": 12.5,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 5.0,
      "pesoFacturable": 12.5,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 45.5,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:14:00.136",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      }
    ],
    "fechaRegistro": "2026-09-06T01:14:00.136"
  },
  {
    "codigoRastreo": "RE-2026-000013",
    "codigoVerificacion": "Q9R7",
    "estadoActual": "REGISTRADO",
    "remitente": {
      "nombres": "Jorge Ramos Peña",
      "dni": "45871236",
      "telefono": "987654321"
    },
    "destinatario": {
      "nombres": "Luisa Quispe Mena",
      "dni": "70125489",
      "telefono": "964112233"
    },
    "autorizados": [
      {
        "nombres": "Marco Quispe Mena",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Caja de repuestos de motor",
      "pesoKg": 12.5,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 5.0,
      "pesoFacturable": 12.5,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 45.5,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:11:30.203",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      }
    ],
    "fechaRegistro": "2026-09-06T01:11:30.203"
  },
  {
    "codigoRastreo": "RE-2026-000012",
    "codigoVerificacion": "L3CH",
    "estadoActual": "ANULADO",
    "remitente": {
      "nombres": "Comercial Del Pino S.A.C.",
      "dni": "20481290",
      "telefono": "987450112"
    },
    "destinatario": {
      "nombres": "Elena Ccanto Ramos",
      "dni": "71458963",
      "telefono": "964238715"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Caja registrada con peso equivocado",
      "pesoKg": 9.0,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 5.0,
      "pesoFacturable": 9.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 35.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:11.363",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "ANULADO",
        "fecha": "2026-09-06T01:05:11.525",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Anulada: Peso mal digitado en la balanza; se vuelve a admitir"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:11.363"
  },
  {
    "codigoRastreo": "RE-2026-000011",
    "codigoVerificacion": "2CCU",
    "estadoActual": "ENTREGADO",
    "remitente": {
      "nombres": "Agroindustria Mantaro",
      "dni": "20991122",
      "telefono": "964550099"
    },
    "destinatario": {
      "nombres": "Diego Salazar Ríos",
      "dni": "42009911",
      "telefono": "988221100"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Muestras de quinua",
      "pesoKg": 3.2,
      "largoCm": 30,
      "anchoCm": 25,
      "altoCm": 20,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 2.5,
      "pesoFacturable": 3.2,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 17.6,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-HYO-CEN",
    "agenciaDestinoId": "AG-LIM-VIC",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:10.617",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Encomienda admitida en Huancayo - Central"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:10.782",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de Huancayo"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:10.89",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Cargado en la unidad LIM-208"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:11.004",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Descarga y control en Lima"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:11.116",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Lima"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:05:11.291",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Entregado a Diego Salazar Ríos (DNI 42009911, titular), clave de seguridad verificada"
      }
    ],
    "entrega": {
      "receptorNombres": "Diego Salazar Ríos",
      "receptorDni": "42009911",
      "parentesco": "Titular",
      "relacion": "TITULAR",
      "claveVerificada": true,
      "fechaEntrega": "2026-09-06T01:05:11.291",
      "usuario": "admin"
    },
    "fechaRegistro": "2026-09-06T01:05:10.617"
  },
  {
    "codigoRastreo": "RE-2026-000010",
    "codigoVerificacion": "B827",
    "estadoActual": "LISTO_PARA_RECOJO",
    "remitente": {
      "nombres": "Editorial Los Andes",
      "dni": "20778899",
      "telefono": "985663322"
    },
    "destinatario": {
      "nombres": "Sofía Meza Landeo",
      "dni": "72334455",
      "telefono": "969887744"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Cajas de libros",
      "pesoKg": 25.0,
      "largoCm": 60,
      "anchoCm": 45,
      "altoCm": 35,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 15.75,
      "pesoFacturable": 25.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 83.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:09.933",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:10.096",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:10.207",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:10.32",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:10.431",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:07:25.207",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Se generó una nueva clave de seguridad a pedido del cliente"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:09.933"
  },
  {
    "codigoRastreo": "RE-2026-000009",
    "codigoVerificacion": "HZ2Y",
    "estadoActual": "ENTREGADO",
    "remitente": {
      "nombres": "Marisol Quintana Ibarra",
      "dni": "41229900",
      "telefono": "983776655"
    },
    "destinatario": {
      "nombres": "Carlos Núñez Bravo",
      "dni": "40556677",
      "telefono": "960221144"
    },
    "autorizados": [
      {
        "nombres": "Marco Núñez Bravo",
        "dni": "44556677",
        "telefono": "955000111"
      }
    ],
    "carga": {
      "descripcion": "Repuestos de motocicleta",
      "pesoKg": 6.0,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 20,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 4.0,
      "pesoFacturable": 6.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 26.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:09.261",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:09.423",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:09.534",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:09.646",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:09.756",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:12:15.948",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Marco Núñez Bravo (DNI 44556677, autorizado), clave de seguridad verificada"
      }
    ],
    "entrega": {
      "receptorNombres": "Marco Núñez Bravo",
      "receptorDni": "44556677",
      "parentesco": "Autorizado",
      "relacion": "AUTORIZADO",
      "claveVerificada": true,
      "fechaEntrega": "2026-09-06T01:12:15.947",
      "usuario": "almacen.huancayo"
    },
    "fechaRegistro": "2026-09-06T01:05:09.261"
  },
  {
    "codigoRastreo": "RE-2026-000008",
    "codigoVerificacion": "HQA3",
    "estadoActual": "ENTREGADO",
    "remitente": {
      "nombres": "Ferretería San Jorge",
      "dni": "20447788",
      "telefono": "984112233"
    },
    "destinatario": {
      "nombres": "Pedro Rojas Camarena",
      "dni": "43112299",
      "telefono": "967443311"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Herramientas manuales",
      "pesoKg": 11.0,
      "largoCm": 50,
      "anchoCm": 35,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 7.29,
      "pesoFacturable": 11.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 41.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:08.579",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:08.742",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:08.853",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:08.965",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:09.078",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:07:25.07",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Pedro Rojas Camarena (DNI 43112299, titular), clave de seguridad verificada"
      }
    ],
    "entrega": {
      "receptorNombres": "Pedro Rojas Camarena",
      "receptorDni": "43112299",
      "parentesco": "Titular",
      "relacion": "TITULAR",
      "claveVerificada": true,
      "fechaEntrega": "2026-09-06T01:07:25.07",
      "usuario": "almacen.huancayo"
    },
    "fechaRegistro": "2026-09-06T01:05:08.579"
  },
  {
    "codigoRastreo": "RE-2026-000007",
    "codigoVerificacion": "S78Y",
    "estadoActual": "EN_ALMACEN_DESTINO",
    "remitente": {
      "nombres": "Luis Barrientos Paz",
      "dni": "09887766",
      "telefono": "977554433"
    },
    "destinatario": {
      "nombres": "Ana Lucía Poma Vega",
      "dni": "70223344",
      "telefono": "962118899"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Documentos legales",
      "pesoKg": 1.5,
      "largoCm": 30,
      "anchoCm": 20,
      "altoCm": 10,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 1.0,
      "pesoFacturable": 1.5,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 12.5,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:07.999",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:08.166",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:08.285",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:08.398",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:07.999"
  },
  {
    "codigoRastreo": "RE-2026-000006",
    "codigoVerificacion": "TKV7",
    "estadoActual": "EN_ALMACEN_DESTINO",
    "remitente": {
      "nombres": "Distribuidora Andina",
      "dni": "20334455",
      "telefono": "986221100"
    },
    "destinatario": {
      "nombres": "Miriam Sedano Rojas",
      "dni": "42887100",
      "telefono": "964003377"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Abarrotes surtidos",
      "pesoKg": 18.0,
      "largoCm": 60,
      "anchoCm": 40,
      "altoCm": 40,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 16.0,
      "pesoFacturable": 18.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 62.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:07.435",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:07.598",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:07.71",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:07.822",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:07.435"
  },
  {
    "codigoRastreo": "RE-2026-000005",
    "codigoVerificacion": "URS3",
    "estadoActual": "EN_TRANSITO",
    "remitente": {
      "nombres": "Repuestos El Motor",
      "dni": "10556677",
      "telefono": "992003311"
    },
    "destinatario": {
      "nombres": "Víctor Lazo Quispe",
      "dni": "73920011",
      "telefono": "961882200"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Kit de frenos",
      "pesoKg": 9.8,
      "largoCm": 45,
      "anchoCm": 35,
      "altoCm": 25,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 6.56,
      "pesoFacturable": 9.8,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 37.4,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:06.981",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:07.146",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Recepción y pesaje en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:07.26",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:06.981"
  },
  {
    "codigoRastreo": "RE-2026-000004",
    "codigoVerificacion": "J8EU",
    "estadoActual": "EN_TRANSITO",
    "remitente": {
      "nombres": "Botica Salud Total",
      "dni": "20609887",
      "telefono": "975330011"
    },
    "destinatario": {
      "nombres": "Rosa Palomino Ayala",
      "dni": "20114477",
      "telefono": "968554433"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Insumos médicos",
      "pesoKg": 6.2,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 25,
      "fragil": true
    },
    "tarifa": {
      "pesoVolumetrico": 5.0,
      "pesoFacturable": 6.2,
      "montoBase": 8.0,
      "recargo": 5.0,
      "total": 31.6,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:06.531",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:06.696",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Recepción y pesaje en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:06.807",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:06.531"
  },
  {
    "codigoRastreo": "RE-2026-000003",
    "codigoVerificacion": "ZWJM",
    "estadoActual": "EN_ALMACEN_ORIGEN",
    "remitente": {
      "nombres": "Textiles Gamarra E.I.R.L.",
      "dni": "20551134",
      "telefono": "981447722"
    },
    "destinatario": {
      "nombres": "Juan Huamán Ticse",
      "dni": "45093318",
      "telefono": "965880021"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Rollos de tela",
      "pesoKg": 22.5,
      "largoCm": 90,
      "anchoCm": 40,
      "altoCm": 40,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 24.0,
      "pesoFacturable": 24.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 80.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:06.176",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:06.351",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Recepción y pesaje en el almacén de origen"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:06.176"
  },
  {
    "codigoRastreo": "RE-2026-000002",
    "codigoVerificacion": "UM48",
    "estadoActual": "REGISTRADO",
    "remitente": {
      "nombres": "Karina Espinoza Vera",
      "dni": "44127865",
      "telefono": "981330447"
    },
    "destinatario": {
      "nombres": "Rubén Ccahuana Solís",
      "dni": "46801237",
      "telefono": "965117788"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Ropa de invierno",
      "pesoKg": 5.5,
      "largoCm": 40,
      "anchoCm": 30,
      "altoCm": 20,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 4.0,
      "pesoFacturable": 5.5,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 24.5,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:05.949",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:05.949"
  },
  {
    "codigoRastreo": "RE-2026-000001",
    "codigoVerificacion": "S725",
    "estadoActual": "REGISTRADO",
    "remitente": {
      "nombres": "Comercial Del Pino S.A.C.",
      "dni": "20481290",
      "telefono": "987450112"
    },
    "destinatario": {
      "nombres": "Elena Ccanto Ramos",
      "dni": "71458963",
      "telefono": "964238715"
    },
    "autorizados": [],
    "carga": {
      "descripcion": "Cajas de útiles de oficina",
      "pesoKg": 14.0,
      "largoCm": 50,
      "anchoCm": 40,
      "altoCm": 30,
      "fragil": false
    },
    "tarifa": {
      "pesoVolumetrico": 10.0,
      "pesoFacturable": 14.0,
      "montoBase": 8.0,
      "recargo": 0.0,
      "total": 50.0,
      "moneda": "PEN"
    },
    "agenciaOrigenId": "AG-LIM-VIC",
    "agenciaDestinoId": "AG-HYO-CEN",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:05.709",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      }
    ],
    "fechaRegistro": "2026-09-06T01:05:05.709"
  }
];

export const AGENCIAS_DEMO: Agencia[] = [
  {
    "id": "6a98600c87f9b76c14d74152",
    "codigo": "AG-LIM-VIC",
    "nombre": "Lima - La Victoria",
    "ciudad": "Lima",
    "direccion": "Av. Mexico 1234 - La Victoria",
    "telefono": "013456789",
    "activo": true
  },
  {
    "id": "6a98600c87f9b76c14d74153",
    "codigo": "AG-LIM-CER",
    "nombre": "Lima - Cercado",
    "ciudad": "Lima",
    "direccion": "Jr. Montevideo 456 - Cercado de Lima",
    "telefono": "013456790",
    "activo": true
  },
  {
    "id": "6a98600c87f9b76c14d74154",
    "codigo": "AG-HYO-CEN",
    "nombre": "Huancayo - Central",
    "ciudad": "Huancayo",
    "direccion": "Av. Ferrocarril 890 - El Tambo",
    "telefono": "064234567",
    "activo": true
  }
];

export const USUARIOS_DEMO: Usuario[] = [
  {
    "id": "6a98600c87f9b76c14d74157",
    "username": "operador.lima",
    "nombreCompleto": "Yefrie Camposano",
    "rol": "OPERADOR",
    "agenciaId": "AG-LIM-VIC",
    "activo": true,
    "debeCambiarClave": false
  },
  {
    "id": "6a98600c87f9b76c14d74158",
    "username": "almacen.huancayo",
    "nombreCompleto": "Andrey Alvarado",
    "rol": "ALMACEN",
    "agenciaId": "AG-HYO-CEN",
    "activo": true,
    "debeCambiarClave": false
  },
  {
    "id": "6a98600c87f9b76c14d74159",
    "username": "admin",
    "nombreCompleto": "Marc Aquino",
    "rol": "ADMIN",
    "agenciaId": "AG-LIM-VIC",
    "activo": true,
    "debeCambiarClave": false
  },
  {
    "id": "6a9c4c7f0742754d43d5410b",
    "username": "operador.huancayo",
    "nombreCompleto": "Ruth Palomino",
    "rol": "OPERADOR",
    "agenciaId": "AG-HYO-CEN",
    "activo": true,
    "debeCambiarClave": false
  },
  {
    "id": "6a9c58e7d3785e16319827af",
    "username": "almacen.lima",
    "nombreCompleto": "Rosa Nunez",
    "rol": "ALMACEN",
    "agenciaId": "AG-LIM-VIC",
    "activo": true,
    "debeCambiarClave": false
  }
];

export const TARIFARIO_DEMO: Tarifario[] = [
  {
    "id": "6a98600c87f9b76c14d74155",
    "ruta": "Lima-Huancayo",
    "montoBase": 8.0,
    "precioPorKg": 3.0,
    "factorVolumetrico": 6000,
    "recargoFragil": 5.0,
    "vigenteDesde": "2026-09-02",
    "activo": true
  },
  {
    "id": "6a98600c87f9b76c14d74156",
    "ruta": "Huancayo-Lima",
    "montoBase": 8.0,
    "precioPorKg": 3.0,
    "factorVolumetrico": 6000,
    "recargoFragil": 5.0,
    "vigenteDesde": "2026-09-02",
    "activo": true
  }
];

export const AVISOS_DEMO: AvisoCliente[] = [
  {
    "id": "6aa1694ac09d020528515797",
    "codigoRastreo": "RE-2026-000017",
    "canal": "REGISTRO",
    "destino": "960221144",
    "mensaje": "Rogger Express: su encomienda RE-2026-000017 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-HYO-CEN",
    "fechaEnvio": "2026-09-09T09:12:26.342",
    "fechaActualizacion": "2026-09-09T09:12:26.346"
  },
  {
    "id": "6a9d0501ae4bd94568959364",
    "codigoRastreo": "RE-2026-000015",
    "canal": "REGISTRO",
    "destino": "960221144",
    "mensaje": "Rogger Express: su encomienda RE-2026-000015 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-HYO-CEN",
    "fechaEnvio": "2026-09-06T01:15:29.894",
    "fechaActualizacion": "2026-09-06T01:15:29.895"
  },
  {
    "id": "6a9d02975b9df5516a85d79c",
    "codigoRastreo": "RE-2026-000011",
    "canal": "REGISTRO",
    "destino": "988221100",
    "mensaje": "Rogger Express: su encomienda RE-2026-000011 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-LIM-VIC",
    "fechaEnvio": "2026-09-06T01:05:11.118",
    "fechaActualizacion": "2026-09-06T01:05:11.118"
  },
  {
    "id": "6a9d02965b9df5516a85d79a",
    "codigoRastreo": "RE-2026-000010",
    "canal": "REGISTRO",
    "destino": "969887744",
    "mensaje": "Rogger Express: su encomienda RE-2026-000010 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-HYO-CEN",
    "fechaEnvio": "2026-09-06T01:05:10.432",
    "fechaActualizacion": "2026-09-06T01:05:10.432"
  },
  {
    "id": "6a9d02955b9df5516a85d798",
    "codigoRastreo": "RE-2026-000009",
    "canal": "REGISTRO",
    "destino": "960221144",
    "mensaje": "Rogger Express: su encomienda RE-2026-000009 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-HYO-CEN",
    "fechaEnvio": "2026-09-06T01:05:09.757",
    "fechaActualizacion": "2026-09-06T01:05:09.758"
  },
  {
    "id": "6a9d02955b9df5516a85d796",
    "codigoRastreo": "RE-2026-000008",
    "canal": "REGISTRO",
    "destino": "967443311",
    "mensaje": "Rogger Express: su encomienda RE-2026-000008 ya se encuentra en la agencia de destino y esta lista para el recojo. Presente su DNI. Consulte en linea con su codigo.",
    "estado": "ENVIADO",
    "intentos": 1,
    "entregaReal": false,
    "referenciaProveedor": "bitacora-local",
    "agenciaDestinoId": "AG-HYO-CEN",
    "fechaEnvio": "2026-09-06T01:05:09.079",
    "fechaActualizacion": "2026-09-06T01:05:09.081"
  }
];

/** El tablero cambia según quién entra: cada rol ve lo suyo. */
export const RESUMEN_DEMO: Record<string, Resumen> = {
  "OPERADOR": {
    "totalEnvios": 17,
    "enTransito": 2,
    "listosParaRecojo": 2,
    "entregadosHoy": 0,
    "porRecogerHace3Dias": 1,
    "misAdmisionesHoy": 1,
    "miCajaHoy": 26.0,
    "porEstado": {
      "REGISTRADO": 5,
      "EN_ALMACEN_ORIGEN": 1,
      "EN_TRANSITO": 2,
      "EN_ALMACEN_DESTINO": 2,
      "LISTO_PARA_RECOJO": 2,
      "ENTREGADO": 4,
      "INCIDENCIA": 0,
      "DEVUELTO": 0,
      "ANULADO": 1
    },
    "porAgenciaDestino": [
      {
        "agenciaId": "AG-HYO-CEN",
        "nombre": "Huancayo - Central",
        "cantidad": 16
      },
      {
        "agenciaId": "AG-LIM-VIC",
        "nombre": "Lima - La Victoria",
        "cantidad": 1
      }
    ]
  },
  "ALMACEN": {
    "totalEnvios": 17,
    "enTransito": 2,
    "listosParaRecojo": 2,
    "entregadosHoy": 0,
    "porRecogerHace3Dias": 1,
    "misAdmisionesHoy": 0,
    "miCajaHoy": 0.0,
    "porEstado": {
      "REGISTRADO": 5,
      "EN_ALMACEN_ORIGEN": 1,
      "EN_TRANSITO": 2,
      "EN_ALMACEN_DESTINO": 2,
      "LISTO_PARA_RECOJO": 2,
      "ENTREGADO": 4,
      "INCIDENCIA": 0,
      "DEVUELTO": 0,
      "ANULADO": 1
    },
    "porAgenciaDestino": [
      {
        "agenciaId": "AG-HYO-CEN",
        "nombre": "Huancayo - Central",
        "cantidad": 16
      },
      {
        "agenciaId": "AG-LIM-VIC",
        "nombre": "Lima - La Victoria",
        "cantidad": 1
      }
    ]
  },
  "ADMIN": {
    "totalEnvios": 17,
    "enTransito": 2,
    "listosParaRecojo": 2,
    "entregadosHoy": 0,
    "porRecogerHace3Dias": 1,
    "misAdmisionesHoy": 0,
    "miCajaHoy": 0.0,
    "ingresosHoy": 26.0,
    "ingresosMes": 689.1,
    "ticketPromedio": 40.54,
    "porEstado": {
      "REGISTRADO": 5,
      "EN_ALMACEN_ORIGEN": 1,
      "EN_TRANSITO": 2,
      "EN_ALMACEN_DESTINO": 2,
      "LISTO_PARA_RECOJO": 2,
      "ENTREGADO": 4,
      "INCIDENCIA": 0,
      "DEVUELTO": 0,
      "ANULADO": 1
    },
    "porAgenciaDestino": [
      {
        "agenciaId": "AG-HYO-CEN",
        "nombre": "Huancayo - Central",
        "cantidad": 16
      },
      {
        "agenciaId": "AG-LIM-VIC",
        "nombre": "Lima - La Victoria",
        "cantidad": 1
      }
    ]
  }
};

/** Consultas públicas ya resueltas, indexadas por "codigo|verificacion". */
export const RASTREOS_DEMO: Record<string, Tracking> = {
  "RE-2026-000017|TVAT": {
    "codigoRastreo": "RE-2026-000017",
    "etapa": 3,
    "etapaEtiqueta": "En destino",
    "mensaje": "Su encomienda está lista para el recojo. Acérquese con su DNI y su clave de seguridad.",
    "desde": "2026-09-09T09:12:26.339",
    "listoParaRecojo": true,
    "finalizado": false,
    "destinatario": "Carlos Núñez Bravo",
    "documentoDestinatario": "*****677",
    "descripcionCarga": "Repuestos de motocicleta",
    "agenciaOrigen": "Lima - La Victoria",
    "agenciaDestino": "Huancayo - Central",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-09T09:12:26.25",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-09T09:12:26.292",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-09T09:12:26.314",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-09T09:12:26.327",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-09T09:12:26.339",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      }
    ]
  },
  "RE-2026-000015|Z7EX": {
    "codigoRastreo": "RE-2026-000015",
    "etapa": 4,
    "etapaEtiqueta": "Entregado",
    "mensaje": "Su encomienda fue entregada.",
    "desde": "2026-09-06T01:17:08.698",
    "listoParaRecojo": false,
    "finalizado": true,
    "destinatario": "Carlos Núñez Bravo",
    "documentoDestinatario": "*****677",
    "descripcionCarga": "Repuestos de motocicleta",
    "agenciaOrigen": "Lima - La Victoria",
    "agenciaDestino": "Huancayo - Central",
    "entrega": {
      "receptorNombres": "Marco Núñez Bravo",
      "documento": "*****677",
      "fecha": "2026-09-06T01:17:08.698"
    },
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:15:29.85",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:15:29.861",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:15:29.873",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:15:29.88",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:15:29.891",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:15:46.386",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Se generó una nueva clave de seguridad a pedido del cliente"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:17:08.698",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Marco Núñez Bravo (DNI 44556677, autorizado), clave de seguridad verificada"
      }
    ]
  },
  "RE-2026-000011|2CCU": {
    "codigoRastreo": "RE-2026-000011",
    "etapa": 4,
    "etapaEtiqueta": "Entregado",
    "mensaje": "Su encomienda fue entregada.",
    "desde": "2026-09-06T01:05:11.291",
    "listoParaRecojo": false,
    "finalizado": true,
    "destinatario": "Diego Salazar Ríos",
    "documentoDestinatario": "*****911",
    "descripcionCarga": "Muestras de quinua",
    "agenciaOrigen": "Huancayo - Central",
    "agenciaDestino": "Lima - La Victoria",
    "entrega": {
      "receptorNombres": "Diego Salazar Ríos",
      "documento": "*****911",
      "fecha": "2026-09-06T01:05:11.291"
    },
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:10.617",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Encomienda admitida en Huancayo - Central"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:10.782",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de Huancayo"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:10.89",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Cargado en la unidad LIM-208"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:11.004",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Descarga y control en Lima"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:11.116",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Lima"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:05:11.291",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "admin",
        "observacion": "Entregado a Diego Salazar Ríos (DNI 42009911, titular), clave de seguridad verificada"
      }
    ]
  },
  "RE-2026-000010|B827": {
    "codigoRastreo": "RE-2026-000010",
    "etapa": 3,
    "etapaEtiqueta": "En destino",
    "mensaje": "Su encomienda está lista para el recojo. Acérquese con su DNI y su clave de seguridad.",
    "desde": "2026-09-06T01:07:25.207",
    "listoParaRecojo": true,
    "finalizado": false,
    "destinatario": "Sofía Meza Landeo",
    "documentoDestinatario": "*****455",
    "descripcionCarga": "Cajas de libros",
    "agenciaOrigen": "Lima - La Victoria",
    "agenciaDestino": "Huancayo - Central",
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:09.933",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:10.096",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:10.207",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:10.32",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:10.431",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:07:25.207",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Se generó una nueva clave de seguridad a pedido del cliente"
      }
    ]
  },
  "RE-2026-000009|HZ2Y": {
    "codigoRastreo": "RE-2026-000009",
    "etapa": 4,
    "etapaEtiqueta": "Entregado",
    "mensaje": "Su encomienda fue entregada.",
    "desde": "2026-09-06T01:12:15.948",
    "listoParaRecojo": false,
    "finalizado": true,
    "destinatario": "Carlos Núñez Bravo",
    "documentoDestinatario": "*****677",
    "descripcionCarga": "Repuestos de motocicleta",
    "agenciaOrigen": "Lima - La Victoria",
    "agenciaDestino": "Huancayo - Central",
    "entrega": {
      "receptorNombres": "Marco Núñez Bravo",
      "documento": "*****677",
      "fecha": "2026-09-06T01:12:15.947"
    },
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:09.261",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:09.423",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:09.534",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:09.646",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:09.756",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:12:15.948",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Marco Núñez Bravo (DNI 44556677, autorizado), clave de seguridad verificada"
      }
    ]
  },
  "RE-2026-000008|HQA3": {
    "codigoRastreo": "RE-2026-000008",
    "etapa": 4,
    "etapaEtiqueta": "Entregado",
    "mensaje": "Su encomienda fue entregada.",
    "desde": "2026-09-06T01:07:25.07",
    "listoParaRecojo": false,
    "finalizado": true,
    "destinatario": "Pedro Rojas Camarena",
    "documentoDestinatario": "*****299",
    "descripcionCarga": "Herramientas manuales",
    "agenciaOrigen": "Lima - La Victoria",
    "agenciaDestino": "Huancayo - Central",
    "entrega": {
      "receptorNombres": "Pedro Rojas Camarena",
      "documento": "*****299",
      "fecha": "2026-09-06T01:07:25.07"
    },
    "historial": [
      {
        "estado": "REGISTRADO",
        "fecha": "2026-09-06T01:05:08.579",
        "agenciaId": "AG-LIM-VIC",
        "usuario": "operador.lima",
        "observacion": "Encomienda admitida en Lima - La Victoria"
      },
      {
        "estado": "EN_ALMACEN_ORIGEN",
        "fecha": "2026-09-06T01:05:08.742",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Recepción en el almacén de origen"
      },
      {
        "estado": "EN_TRANSITO",
        "fecha": "2026-09-06T01:05:08.853",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Cargado en la unidad HYO-114"
      },
      {
        "estado": "EN_ALMACEN_DESTINO",
        "fecha": "2026-09-06T01:05:08.965",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Descarga y control en Huancayo"
      },
      {
        "estado": "LISTO_PARA_RECOJO",
        "fecha": "2026-09-06T01:05:09.078",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "admin",
        "observacion": "Disponible en ventanilla de Huancayo"
      },
      {
        "estado": "ENTREGADO",
        "fecha": "2026-09-06T01:07:25.07",
        "agenciaId": "AG-HYO-CEN",
        "usuario": "almacen.huancayo",
        "observacion": "Entregado a Pedro Rojas Camarena (DNI 43112299, titular), clave de seguridad verificada"
      }
    ]
  }
};
