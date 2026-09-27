"""Build excel-compare.html: index.html with the SheetJS library inlined (single offline file)."""
s = open('index.html', encoding='utf-8').read()
lib = open('lib/xlsx.full.min.js', encoding='utf-8').read().replace('</script', '<\\/script')
start = s.index('<script src="lib/xlsx.full.min.js"></script>')
end_marker = "<\\/script>')</script>"
end = s.index(end_marker) + len(end_marker)
open('excel-compare.html', 'w', encoding='utf-8').write(s[:start] + '<script>\n' + lib + '\n</script>' + s[end:])
