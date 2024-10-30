export function getPageNumber(url: string): number {
  const urlObj = new URL(url)
  const pageNumber = urlObj.searchParams.get('page[number]')
  return pageNumber ? parseInt(pageNumber, 10) : 50 // Default to 50 if not present
}
