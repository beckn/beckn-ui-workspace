import Handlebars from 'handlebars'

interface TemplateConfig {
  name?: string
  description?: string
  html?: string
  dataPaths?: Record<string, string>
}

interface StylingHints {
  /** Badge styles using template HTML class names: .item-badge.item-badge-{key} */
  itemBadge?: {
    [key: string]: {
      backgroundColor?: string
      color?: string
      text?: string
    }
  }
  dietaryBadge?: {
    [key: string]: {
      backgroundColor?: string
      color?: string
      text?: string
    }
  }
  cardLayout?: {
    default?: string
    alternatives?: string[]
  }
  [key: string]: unknown
}

interface RendererConfig {
  templates?: {
    discoveryCard?: TemplateConfig
    detailView?: TemplateConfig
    compactCard?: TemplateConfig
    [key: string]: TemplateConfig | undefined
  }
  stylingHints?: StylingHints
  [key: string]: unknown
}

// Default fallback image
const DEFAULT_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='

/**
 * Normalize item so address/location resolves for renderer templates.
 * Template expects beckn:itemAttributes.chargingStation.serviceLocation (with address).
 * Data may have: beckn:availableAt[0].address, or beckn:itemAttributes.serviceLocation.address.
 */
function normalizeItemForTemplate(item: unknown): Record<string, unknown> {
  const rec = (item && typeof item === 'object' ? { ...(item as Record<string, unknown>) } : {}) as Record<
    string,
    unknown
  >
  const itemAttributes = (rec['beckn:itemAttributes'] ?? rec['itemAttributes']) as Record<string, unknown> | undefined
  if (!itemAttributes || typeof itemAttributes !== 'object') return rec
  const attrs = { ...itemAttributes }
  const existing = (attrs['chargingStation'] as Record<string, unknown> | undefined)?.serviceLocation
  if (existing) return rec
  const availableAt = (rec['beckn:availableAt'] ?? rec['availableAt']) as unknown[] | undefined
  const firstLocation =
    Array.isArray(availableAt) && availableAt[0] && typeof availableAt[0] === 'object'
      ? (availableAt[0] as Record<string, unknown>)
      : null
  const directServiceLocation = attrs['serviceLocation']
  const serviceLocation =
    directServiceLocation && typeof directServiceLocation === 'object' ? directServiceLocation : firstLocation
  if (serviceLocation) {
    attrs['chargingStation'] = { serviceLocation }
    rec['beckn:itemAttributes'] = attrs
  }
  return rec
}

// Helper function to get nested value from object using dot notation path
const getNestedValue = (obj: unknown, path: string): unknown => {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return current
}

// Helper function to get value from object using bracket notation (e.g., "array[0]")
const getValueByPath = (obj: unknown, path: string): unknown => {
  // Handle array access like "beckn:offers[0].beckn:price.value"
  const arrayMatch = path.match(/^(.+?)\[(\d+)\](.*)$/)
  if (arrayMatch) {
    const [, basePath, index, restPath] = arrayMatch
    const baseValue = getNestedValue(obj, basePath)
    if (Array.isArray(baseValue) && baseValue[parseInt(index)]) {
      if (restPath) {
        return getValueByPath(baseValue[parseInt(index)], restPath.startsWith('.') ? restPath.slice(1) : restPath)
      }
      return baseValue[parseInt(index)]
    }
    return undefined
  }

  return getNestedValue(obj, path)
}

// Preprocess template to replace all {{path}} with {{resolve path}} for colon-separated keys
// Replace brackets with placeholders to avoid Handlebars parsing issues
const preprocessTemplate = (templateHtml: string): string => {
  let processed = templateHtml

  // Step 1: Replace {{get "path"}} - check if it's an image path and use imageHelper
  processed = processed.replace(/\{\{get\s+"([^"]+)"\s*\}\}/g, (match, path) => {
    // Replace [0], [1], etc. with __ARRAY_0__, __ARRAY_1__, etc.
    const pathWithPlaceholders = path.replace(/\[(\d+)\]/g, '__ARRAY_$1__')
    // Check if this is an image path (contains 'image' in the path)
    if (path.toLowerCase().includes('image')) {
      return `{{imageHelper "${pathWithPlaceholders}"}}`
    }
    return `{{resolveHelper "${pathWithPlaceholders}"}}`
  })

  // Step 2: Handle block helpers with colon paths and track which ones we replace
  const replacedHelpers = new Set<string>()
  processed = processed.replace(/\{\{#(if|each)\s+([^}]+)\}\}/g, (match, helper, path) => {
    const trimmed = path.trim()
    // Skip if already processed
    if (trimmed.includes('"') || trimmed.includes('(') || trimmed.includes('resolve') || trimmed.includes('Helper')) {
      return match
    }
    if (trimmed.includes(':') || trimmed.includes('[')) {
      const pathWithPlaceholders = trimmed.replace(/\[(\d+)\]/g, '__ARRAY_$1__')
      replacedHelpers.add(helper)
      return `{{#${helper}Helper "${pathWithPlaceholders}"}}`
    }
    return match
  })

  // Step 2b: Replace corresponding closing tags for helpers we replaced
  if (replacedHelpers.has('if')) {
    processed = processed.replace(/\{\{\/if\}\}/g, '{{/ifHelper}}')
  }
  if (replacedHelpers.has('each')) {
    processed = processed.replace(/\{\{\/each\}\}/g, '{{/eachHelper}}')
  }

  // Step 3: Replace simple variable patterns that contain colons or brackets
  processed = processed.replace(/\{\{([^}]+)\}\}/g, (match, content) => {
    const trimmed = content.trim()

    // Skip closing tags (already processed)
    if (trimmed.startsWith('/')) {
      return match
    }

    // Skip block helpers (already processed)
    if (trimmed.startsWith('#if') || trimmed.startsWith('#each')) {
      return match
    }

    // Skip if already a helper call
    if (
      trimmed.includes('"') ||
      trimmed.includes('(') ||
      trimmed.includes('resolve') ||
      trimmed.includes('Helper') ||
      trimmed.includes('get')
    ) {
      return match
    }

    // If it contains colon or bracket, use resolve helper
    if (content.includes(':') || content.includes('[')) {
      // Replace brackets with placeholders
      const pathWithPlaceholders = content.trim().replace(/\[(\d+)\]/g, '__ARRAY_$1__')

      // Check if this is an HTML content field (longDesc, longDescription, etc.)
      const lowerPath = pathWithPlaceholders.toLowerCase()
      if (
        lowerPath.includes('longdesc') ||
        lowerPath.includes('long_desc') ||
        (lowerPath.includes('description') && lowerPath.includes('long')) ||
        lowerPath.includes('html') ||
        lowerPath.includes('content')
      ) {
        // Use triple braces for unescaped HTML
        return `{{{htmlHelper "${pathWithPlaceholders}"}}}`
      }

      return `{{resolveHelper "${pathWithPlaceholders}"}}`
    }

    return match
  })

  return processed
}

// Register Handlebars helper to resolve any path (handles colons, arrays, nested paths)
// Using resolveHelper to avoid conflicts and restore bracket placeholders
Handlebars.registerHelper('resolveHelper', function (this: unknown, path: string) {
  // Restore bracket placeholders: __ARRAY_0__ -> [0]
  const restoredPath = path.replace(/__ARRAY_(\d+)__/g, '[$1]')
  const value = getValueByPath(this, restoredPath)
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  // Return as regular string (will be escaped by Handlebars)
  return String(value)
})

// Helper for HTML content (unescaped) - for fields like longDesc
Handlebars.registerHelper('htmlHelper', function (this: unknown, path: string) {
  // Restore bracket placeholders: __ARRAY_0__ -> [0]
  const restoredPath = path.replace(/__ARRAY_(\d+)__/g, '[$1]')
  const value = getValueByPath(this, restoredPath)
  if (value === null || value === undefined) {
    return ''
  }
  // Return as SafeString so Handlebars doesn't escape it
  return new Handlebars.SafeString(String(value))
})

// Helper for image URLs with fallback
Handlebars.registerHelper('imageHelper', function (this: unknown, path: string) {
  // Restore bracket placeholders: __ARRAY_0__ -> [0]
  const restoredPath = path.replace(/__ARRAY_(\d+)__/g, '[$1]')
  const imageUrl = getValueByPath(this, restoredPath)

  // If image URL exists and is valid, return it; otherwise return default
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    return imageUrl
  }
  return DEFAULT_IMAGE
})

// Custom block helpers for if and each that handle colon paths as strings
Handlebars.registerHelper('ifHelper', function (this: unknown, path: string, options?: Handlebars.HelperOptions) {
  // Restore bracket placeholders
  const restoredPath = path.replace(/__ARRAY_(\d+)__/g, '[$1]')
  const value = getValueByPath(this, restoredPath)

  if (value && options) {
    return options.fn(this)
  }
  return options?.inverse ? options.inverse(this) : ''
})

Handlebars.registerHelper('eachHelper', function (this: unknown, path: string, options?: Handlebars.HelperOptions) {
  // Restore bracket placeholders
  const restoredPath = path.replace(/__ARRAY_(\d+)__/g, '[$1]')
  const value = getValueByPath(this, restoredPath)

  if (Array.isArray(value) && options) {
    return value
      .map((item, index) =>
        options.fn(item, {
          data: {
            index,
            first: index === 0,
            last: index === value.length - 1
          }
        })
      )
      .join('')
  }
  return ''
})

export const fetchRendererConfig = async (contextUrl: string): Promise<RendererConfig> => {
  const rendererUrl = contextUrl.replace('context.jsonld', 'renderer.json')
  const response = await fetch(rendererUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch renderer config: ${response.statusText}`)
  }
  return await response.json()
}

// Apply styling hints to rendered HTML and add image error handling
const applyStylingHints = (html: string, stylingHints?: StylingHints): string => {
  let styledHtml = html

  // Add image error handling - add onerror handler to all images
  styledHtml = styledHtml.replace(/<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi, (match, before, src, after) => {
    // Check if onerror already exists
    if (match.includes('onerror')) {
      return match
    }
    // Add onerror handler to use default image
    return `<img${before}src="${src}"${after} onerror="this.src='${DEFAULT_IMAGE}';this.onerror=null;">`
  })

  // Also handle images without explicit src (using template variables)
  styledHtml = styledHtml.replace(/<img([^>]*?)>/gi, match => {
    // Check if onerror already exists or if src is missing
    if (match.includes('onerror') || !match.includes('src=')) {
      return match
    }
    // Add onerror handler
    return match.replace(/>$/, ` onerror="this.src='${DEFAULT_IMAGE}';this.onerror=null;">`)
  })

  // Apply badge styles using template HTML class names (.item-badge.item-badge-{key}) or legacy (.dietary-badge.dietary-{key})
  const badgeConfig = stylingHints?.itemBadge ?? stylingHints?.dietaryBadge
  const useItemBadgeClasses = Boolean(stylingHints?.itemBadge)
  if (badgeConfig) {
    const badgeStyles: string[] = []
    Object.entries(badgeConfig).forEach(([key, style]) => {
      if (style.backgroundColor || style.color) {
        const selector = useItemBadgeClasses ? `.item-badge.item-badge-${key}` : `.dietary-badge.dietary-${key}`
        badgeStyles.push(
          `${selector} { ${style.backgroundColor ? `background-color: ${style.backgroundColor};` : ''} ${
            style.color ? `color: ${style.color};` : ''
          } padding: 4px 8px; border-radius: 4px; display: inline-block; font-size: 12px; font-weight: 500; }`
        )
      }
    })

    if (badgeStyles.length > 0) {
      const styleTag = `<style>${badgeStyles.join(' ')}</style>`
      styledHtml = styleTag + styledHtml
    }
  }

  return styledHtml
}

export const renderTemplate = (
  templateHtml: string,
  item: unknown,
  offers: unknown[],
  stylingHints?: StylingHints
): string => {
  // Find matching offer for this item
  const itemId = getNestedValue(item, 'beckn:id') as string
  const matchingOffer = offers.find((offer: unknown) => {
    const offerItems = getNestedValue(offer, 'beckn:items') as string[] | undefined
    return offerItems?.includes(itemId)
  })

  // Normalize so address resolves: template expects itemAttributes.chargingStation.serviceLocation
  const normalizedItem = normalizeItemForTemplate(item)
  const context: Record<string, unknown> = {
    ...normalizedItem,
    'beckn:offers': matchingOffer ? [matchingOffer] : []
  }

  // Preprocess template to handle colon-separated keys
  const processedTemplate = preprocessTemplate(templateHtml)

  // Compile and render template
  const template = Handlebars.compile(processedTemplate)
  let rendered = template(context)

  // Apply styling hints
  rendered = applyStylingHints(rendered, stylingHints)

  return rendered
}

export const getTemplate = (
  config: RendererConfig,
  templateName: 'discoveryCard' | 'detailView' | 'compactCard'
): TemplateConfig | null => {
  return config.templates?.[templateName] || null
}

export const getStylingHints = (config: RendererConfig): StylingHints | undefined => {
  return config.stylingHints
}
