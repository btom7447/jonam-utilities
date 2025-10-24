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
      } else if (["brand_link", "category_link"].includes(field)) {
        // ✅ Airtable expects array of IDs for linked fields
        if (typeof val === "string") {
          normalized[field] = [val];
        } else if (val?.value) {
          normalized[field] = [val.value];
        } else {
          normalized[field] = [];
        }
      } else {
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

  // --- Normalize text fields from arrays (for Airtable long text fields) ---
  if (config.textArrayFields?.length) {
    config.textArrayFields.forEach((field) => {
      const val = normalized[field];
      if (Array.isArray(val)) {
        normalized[field] = val.join(", "); // join array into comma-separated string
      } else if (typeof val !== "string") {
        normalized[field] = "";
      }
    });
  }

  // --- Normalize array fields (safe default) ---
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