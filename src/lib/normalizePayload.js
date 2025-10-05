// Normalize payloads dynamically for Airtable records
export function normalizePayload(payload, config = {}) {
  // config: { numberFields: [], imageFields: [], selectFields: [] }
  const normalized = { ...payload };

  // --- Convert number fields ---
  if (config.numberFields?.length) {
    config.numberFields.forEach((field) => {
      if (normalized[field] !== undefined && normalized[field] !== null) {
        let value = parseFloat(normalized[field]); // use parseFloat

        // Special case for discount: convert % to decimal
        if (field === "discount") {
          value = value > 1 ? value / 100 : value; // 20 => 0.2, 2 => 0.02, 0.03 => 0.03
        }

        normalized[field] = value || 0;
      }
    });
  }

  // --- Convert array fields (variants, product_colors) ---
  const arrayFields = ["variants", "product_colors"];
  arrayFields.forEach((field) => {
    if (normalized[field] && typeof normalized[field] === "string") {
      normalized[field] = normalized[field]
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (!Array.isArray(normalized[field])) {
      normalized[field] = [];
    }
  });

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
        // Convert any boolean or object to string "true"/"false"
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
        // existing logic for other selects
        if (typeof val === "string") {
          normalized[field] = { label: val, value: val };
        } else if (val.label && val.value) {
          normalized[field] = val;
        } else if (val.name) {
          normalized[field] = {
            label: val.name,
            value: val.id || val.recordId,
          };
        }
      }
    });
  }

  return normalized;
}
