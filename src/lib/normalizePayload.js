// Normalize payloads dynamically for Airtable records
export function normalizePayload(payload, config = {}) {
  // config: { numberFields: [], imageFields: [] }
  const normalized = { ...payload };

  // --- Convert number fields ---
  if (config.numberFields?.length) {
    config.numberFields.forEach((field) => {
      if (normalized[field] !== undefined && normalized[field] !== null) {
        normalized[field] = parseInt(normalized[field], 10);
      }
    });
  }

  // --- Normalize image fields ---
  if (config.imageFields?.length) {
    config.imageFields.forEach((field) => {
      const val = normalized[field];
      if (!val) {
        normalized[field] = [];
      } else if (typeof val === "string") {
        normalized[field] = [{ url: val }];
      } else if (Array.isArray(val)) {
        normalized[field] = val.map((img) =>
          typeof img === "string" ? { url: img } : { url: img.url }
        );
      } else if (val.url) {
        normalized[field] = [{ url: val.url }];
      }
    });
  }

  return normalized;
}
