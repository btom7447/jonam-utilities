export function normalizePayload(entity, payload, helpers = {}) {
  const normalized = { ...payload };

  // Handle images
  if (normalized.image) {
    normalized.image = Array.isArray(normalized.image)
      ? normalized.image.map((url) => (typeof url === "string" ? { url } : url))
      : [{ url: normalized.image }];
  }

  // Boolean conversion
  if (normalized.featured !== undefined) {
    normalized.featured = normalized.featured ? "true" : "false";
  }

  // Numeric fields (general)
  ["price", "discount", "quantity", "product_number"].forEach((key) => {
    if (normalized[key] !== undefined && normalized[key] !== "") {
      normalized[key] =
        key === "quantity"
          ? parseInt(normalized[key], 10) || 0
          : parseFloat(normalized[key]) || 0;
    }
  });

  // ---- Entity-specific transforms ----

  if (entity === "product") {
    const { categories = [], brands = [] } = helpers;

    if (normalized.brand) {
      const brandRecord = brands.find((b) => b.name === normalized.brand);
      normalized.brand_link = brandRecord?.recordId ? [brandRecord.recordId] : [];
      delete normalized.brand;
    }

    if (normalized.category) {
      const categoryRecord = categories.find((c) => c.caption === normalized.category);
      normalized.category_link = categoryRecord?.recordId ? [categoryRecord.recordId] : [];
      delete normalized.category;
    }

    if (typeof normalized.variants === "string") {
      normalized.variants = normalized.variants.split(",").map((v) => v.trim());
    }
  }

  if (entity === "handyman") {
    if (typeof normalized.skills === "string") {
      normalized.skills = normalized.skills.split(",").map((s) => s.trim());
    }
  }

  if (entity === "project") {
    if (typeof normalized.tags === "string") {
      normalized.tags = normalized.tags.split(",").map((t) => t.trim());
    }
  }

  return normalized;
}
