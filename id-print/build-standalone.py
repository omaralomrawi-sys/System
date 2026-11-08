"""Build id-print.html: index.html with jsPDF + pdf.js (and its worker) inlined into one offline file."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s = open('index.html', encoding='utf-8').read()
def lib(n): return open('lib/' + n, encoding='utf-8').read().replace('</script', '<\\/script')
s = s.replace('<script src="lib/jspdf.umd.min.js"></script>', '<script>\n' + lib('jspdf.umd.min.js') + '\n</script>')
s = s.replace('<script src="lib/pdf.min.js"></script>', '<script>\n' + lib('pdf.min.js') + '\n</script>')
s = s.replace('<script type="text/plain" id="pdfworker"></script>', '<script type="text/plain" id="pdfworker">\n' + lib('pdf.worker.min.js') + '\n</script>')
open('id-print.html', 'w', encoding='utf-8').write(s)
print('ok', len(s))
