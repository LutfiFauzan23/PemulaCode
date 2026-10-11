export type InterpolationParams = Record<string, number | string>;

/**
 * Isi placeholder `{nama}` di sebuah template terjemahan.
 *
 * Placeholder yang tidak punya nilai dibiarkan apa adanya supaya salah ketik
 * langsung terlihat di layar, bukan menghilang tanpa jejak.
 */
export function interpolate(template: string, params?: InterpolationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}
