// Normalize payloads dynamically for Airtable records
export function normalizePayload(payload, config = {}) {
  const normalized = { ...payload };

  // --- Convert number fields ---
  if (config.numberFields?.length) {
    config.numberFields.forEach((field) => {
      if (normalized[field] !== undefined && normalized[field] !== null) {
        let value = parseFloat(normalized[field]);
        normalized[field] = isNaN(value) ? 0 : value;
      }
    });
  }

  // --- Convert discount percentage (e.g. 5 -> 0.05) ---
  if (normalized.discount !== undefined && normalized.discount !== null) {
    const discount = parseFloat(normalized.discount);
    normalized.discount = discount > 1 ? discount / 100 : discount;
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
          typeof img === "string" ? { url: img } : { url: img.url || img }
        );
      } else if (val.url) {
        normalized[field] = [{ url: val.url }];
      }
    });
  }

  // --- Normalize select fields ---
  if (config.selectFields?.length) {
    config.selectFields.forEach((field) => {
      let val = normalized[field];
      if (!val) {
        normalized[field] = null;
      } else if (field === "featured") {
        if (typeof val === "boolean") {
          normalized[field] = val ? "true" : "false";
        } else if (typeof val === "string") {
          normalized[field] = val.toLowerCase();
        } else if (val.label) {
          normalized[field] = val.label.toLowerCase();
        } else {
          normalized[field] = "false";
        }
      } else {
        // 👇 FIX: ensure select fields use only their `value` if object
        if (typeof val === "string") {
          normalized[field] = val;
        } else if (val && typeof val === "object") {
          normalized[field] = val.value || val.label || "";
        } else {
          normalized[field] = "";
        }
      }
    });
  }

  // --- Normalize array fields (NEW + SAFE) ---
  if (config.arrayFields?.length) {
    config.arrayFields.forEach((field) => {
      const val = normalized[field];
      if (typeof val === "string") {
        normalized[field] = val
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      } else if (!Array.isArray(val)) {
        normalized[field] = [];
      }
    });
  }

  return normalized;
}
