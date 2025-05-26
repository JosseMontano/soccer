export function tiempoRelativo(fechaStr: string): string {
  const fecha = new Date(fechaStr);
  fecha.setHours(fecha.getHours() + 4);
  if (isNaN(fecha.getTime())) return "Fecha inválida";

  const ahora = new Date();
  const diffMs = fecha.getTime() - ahora.getTime();

  const segundos = Math.round(diffMs / 1000);
  const minutos = Math.round(diffMs / (1000 * 60));
  const horas = Math.round(diffMs / (1000 * 60 * 60));
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const semanas = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
  const meses = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  const años = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365));

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (Math.abs(segundos) < 60) return rtf.format(segundos, "second");
  if (Math.abs(minutos) < 60) return rtf.format(minutos, "minute");
  if (Math.abs(horas) < 24) return rtf.format(horas, "hour");
  if (Math.abs(dias) < 7) return rtf.format(dias, "day");

  // Semana personalizada (e.g. "la próxima semana")
  if (Math.abs(semanas) === 1) {
    return semanas > 0 ? "La próxima semana" : "La semana pasada";
  }

  if (Math.abs(semanas) < 5) return rtf.format(semanas, "week");
  if (Math.abs(meses) < 12) return rtf.format(meses, "month");
  return rtf.format(años, "year");
}
