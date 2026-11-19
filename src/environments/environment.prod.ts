export const environment = {
  produccion: true,

  /** API desplegada en Render, conectada a MongoDB Atlas. */
  apiUrl: 'https://rogger-backend.onrender.com/api/v1',

  nombreSistema: 'Rogger Express',

  /**
   * El modo escaparate queda apagado: la aplicación consume la API real.
   * Si se enciende, responde con datos propios sin salir a la red, que es
   * como se publicó mientras el back-end no estaba desplegado.
   */
  demo: false,
};
