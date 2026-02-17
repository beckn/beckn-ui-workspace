/** Wraps the price block in template HTML with <strong class="ev-price"> so price renders bold. Supports both prefixed (beckn:) and plain keys. */
export function wrapTemplatePriceInBold(templateHtml: string): string {
  const prefixedRe =
    /\{\{beckn:offers\[0\]\.beckn:price\.currency\}\}[\s\S]*?\{\{beckn:offers\[0\]\.beckn:price\.applicableQuantity\.unitText\}\}/
  const plainRe = /\{\{offers\[0\]\.price\.currency\}\}[\s\S]*?\{\{offers\[0\]\.price\.applicableQuantity\.unitText\}\}/
  return templateHtml
    .replace(prefixedRe, match => `<strong class="ev-price">${match}</strong>`)
    .replace(plainRe, match => `<strong class="ev-price">${match}</strong>`)
}
