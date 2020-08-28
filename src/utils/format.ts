import * as prettier from 'prettier'

export const format = (content: string) => {
  return prettier.format(content, {parser: 'typescript'})
}
