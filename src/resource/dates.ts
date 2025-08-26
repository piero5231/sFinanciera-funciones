/**
 * Ajusta una fecha según los parámetros especificados.
 *
 * @param {Object} params - Los parámetros de la función.
 * @param {number} params.base - La fecha base a ajustar.
 * @param {number} params.dias - La cantidad de días a sumar a la fecha base.
 * @param {number} params.meses - La cantidad de meses a sumar a la fecha base.
 * @param {number} params.anios - La cantidad de años a sumar a la fecha base.
 *
 * @returns {string} - La fecha ajustada en formato ISO, sin la hora.
 *
 * @example
 * const fecha = fechaAjuste({ base: new Date(), dias: -1 });
 * console.log(fecha); // '2021-08-31'
 */
export const fechaAjuste = ({
  base,
  dias,
  meses,
  anios,
}: {
  base: Date;
  dias?: number;
  meses?: number;
  anios?: number;
}) => {
  const fecha = new Date(base);
  if (dias) fecha.setDate(fecha.getDate() + dias);
  if (meses) fecha.setMonth(fecha.getMonth() + meses);
  if (anios) fecha.setFullYear(fecha.getFullYear() + anios);
  return fecha.toISOString().split('T')[0];
};

/**
 * Obtiene la fecha de inicio del año actual.
 *
 * @param {Object} params - Los parámetros de la función.
 * @param {number} params.base - La fecha base a ajustar.
 *
 * @returns {string} - La fecha de inicio del año actual en formato ISO, sin la hora.
 *
 * @example
 * const fecha = fechaHastaHoyAnio({ base: new Date() });
 * console.log(fecha); // '2021-01-01'
 */
export const fechaHastaHoyAnio = ({ base }: { base: Date }) => {
  const fecha = new Date(base);
  fecha.setMonth(0);
  fecha.setDate(1);
  return fecha.toISOString().split('T')[0];
};
