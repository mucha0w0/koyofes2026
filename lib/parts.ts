import {
  fetchPartsFromMicroCMS,
  type MicroCMSPart,
} from "@/lib/microcms"
import {
  PART_CATEGORY_CONFIG,
  type PartCategory,
  type PartItem,
  type PartSection,
  type PartSocialLink,
} from "@/lib/types/part"

function getPartCategory(part: MicroCMSPart): PartCategory {
  const category = Array.isArray(part.category)
    ? part.category[0]
    : part.category
  if (category && category in PART_CATEGORY_CONFIG) {
    return category as PartCategory
  }
  return "PARTS"
}

export function transformMicroCMSPart(part: MicroCMSPart): PartItem {
  const social: PartSocialLink[] = []
  if (part.instaID) {
    const handle = part.instaID.replace(/^@/, "")
    social.push({
      platform: "instagram",
      label: "Instagram",
      url: `https://instagram.com/${handle}`,
      handle: `@${handle}`,
    })
  }
  return {
    id: part.id,
    name: part.name,
    icon: part.icon?.url ?? "",
    description: part.explanation,
    social,
    category: getPartCategory(part),
  }
}

export async function getPartSections(): Promise<PartSection[]> {
  const parts = await fetchPartsFromMicroCMS()
  const items = parts
    .map(transformMicroCMSPart)
    .sort(
      (a, b) =>
        PART_CATEGORY_CONFIG[a.category].order -
          PART_CATEGORY_CONFIG[b.category].order ||
        a.name.localeCompare(b.name, "ja")
    )
  const grouped = new Map<PartCategory, PartItem[]>()
  for (const item of items) {
    const sectionItems = grouped.get(item.category) ?? []
    sectionItems.push(item)
    grouped.set(item.category, sectionItems)
  }
  return (Object.keys(PART_CATEGORY_CONFIG) as PartCategory[])
    .sort(
      (a, b) => PART_CATEGORY_CONFIG[a].order - PART_CATEGORY_CONFIG[b].order
    )
    .map((category) => {
      const config = PART_CATEGORY_CONFIG[category]
      return {
        id: config.id,
        label: config.label,
        labelEn: config.labelEn,
        items: grouped.get(category) ?? [],
      }
    })
    .filter((section) => section.items.length > 0)
}