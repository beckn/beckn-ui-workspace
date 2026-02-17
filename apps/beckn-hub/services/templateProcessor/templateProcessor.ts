/**
 * Template processor service.
 * Independent: receives renderer config (from renderer.json) + data; returns render-ready output.
 * No dependency on Beckn APIs or payloads.
 */
import Handlebars from 'handlebars'

export interface TemplateConfig {
  name?: string
  description?: string
  html?: string
  dataPaths?: Record<string, string>
  [key: string]: unknown
}

export interface RendererConfig {
  templates?: {
    discoveryCard?: TemplateConfig
    detailView?: TemplateConfig
    compactCard?: TemplateConfig
    [key: string]: TemplateConfig | undefined
  }
  stylingHints?: Record<string, unknown>
  [key: string]: unknown
}

export interface TemplateProcessInput {
  /** Renderer config (e.g. from renderer.json) */
  rendererConfig: RendererConfig
  /** Data to inject (e.g. catalog item, order) */
  data: Record<string, unknown>
  /** Template key to use (e.g. 'discoveryCard', 'detailView') */
  templateKey?: string
}

export interface TemplateProcessOutput {
  /** Rendered HTML string */
  html: string
  /** Template key used */
  templateKey: string
  /** Resolved data used for rendering */
  data: Record<string, unknown>
}

const getNested = (obj: unknown, path: string): unknown => {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

Handlebars.registerHelper('get', function (this: unknown, path: string) {
  const value = getNested(this, path)
  if (value == null) return ''
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
})

/**
 * Process template: compile renderer template with data and return HTML + metadata.
 */
export function processTemplate(input: TemplateProcessInput): TemplateProcessOutput {
  const { rendererConfig, data, templateKey: requestedKey } = input
  const templates = rendererConfig.templates ?? {}
  const key = requestedKey ?? 'discoveryCard'
  const templateConfig = templates[key] ?? templates.discoveryCard ?? { html: '<div>No template</div>' }
  const htmlSource = (templateConfig.html as string) ?? '<div>No template</div>'

  const compiled = Handlebars.compile(htmlSource)
  const html = compiled(data)

  return {
    html,
    templateKey: key,
    data
  }
}

/**
 * Process multiple items (e.g. discovery list): returns array of render outputs.
 */
export function processTemplateList(
  rendererConfig: RendererConfig,
  items: Record<string, unknown>[],
  templateKey?: string
): TemplateProcessOutput[] {
  return items.map(item =>
    processTemplate({
      rendererConfig,
      data: item,
      templateKey: templateKey ?? 'discoveryCard'
    })
  )
}
