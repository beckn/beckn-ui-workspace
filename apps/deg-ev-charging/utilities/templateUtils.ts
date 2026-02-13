/** Wraps the price block in template HTML with <strong class="ev-price"> so price renders bold */
export function wrapTemplatePriceInBold(templateHtml: string): string {
  const priceBlockRe =
    /\{\{beckn:offers\[0\]\.beckn:price\.currency\}\}[\s\S]*?\{\{beckn:offers\[0\]\.beckn:price\.applicableQuantity\.unitText\}\}/
  return templateHtml.replace(priceBlockRe, match => `<strong class="ev-price">${match}</strong>`)
}
