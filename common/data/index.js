import { readFileSync, writeFileSync } from 'node:fs'

function convert(filename) {
  const data = readFileSync(filename, 'utf8')

  const rows = data.split('\n').filter(Boolean)

  const result = rows.map((row) => {
    let _first = ''
    let _rest = ''
    let _year = 0
    let _month = 0
    if (row.includes('月')) {
      if (row.includes('岁')) {
        const [first, rest] = row.split('月')
        _first = first
        _rest = rest
        const [year, month] = _first.split('岁')
        _year = year.replaceAll(',', '')
        _year = Number.parseInt(_year, 10)
        _month = month.replaceAll(',', '')
        _month = Number.parseInt(_month, 10)
      }
      else {
        const [month, rest] = row.split('月')
        _month = month.replaceAll(',', '')
        _month = Number.parseInt(_month, 10)
        _rest = rest
      }
    }
    else {
      const [year, rest] = row.split('岁')
      _year = year.replaceAll(',', '')
      _year = Number.parseInt(_year, 10)
      _rest = rest
    }
    const m = _year * 12 + _month
    return `${m}${_rest}`
  })
  const content = result.join('\n')

  writeFileSync(`${filename}.csv`, content)
}

convert('boy.height')
convert('boy.weight')
convert('girl.weight')
convert('girl.height')
