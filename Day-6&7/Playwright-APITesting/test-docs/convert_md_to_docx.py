import sys
from docx import Document

# Simple markdown to docx converter (handles headings #/##/### and paragraphs and lists)

def md_to_docx(md_path, docx_path):
    doc = Document()
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    list_mode = False

    for raw in lines:
        line = raw.rstrip('\n')
        if not line.strip():
            # blank line -> end any list and add paragraph break
            list_mode = False
            continue

        if line.startswith('# '):
            doc.add_heading(line[2:].strip(), level=1)
            list_mode = False
        elif line.startswith('## '):
            doc.add_heading(line[3:].strip(), level=2)
            list_mode = False
        elif line.startswith('### '):
            doc.add_heading(line[4:].strip(), level=3)
            list_mode = False
        elif line.strip().startswith('- '):
            # simple bulleted list
            text = line.strip()[2:]
            p = doc.add_paragraph(style='List Bullet')
            p.add_run(text)
            list_mode = True
        elif line.strip().startswith('1.') or line.strip().startswith('2.') or line.strip().startswith('3.'):
            p = doc.add_paragraph(style='List Number')
            p.add_run(line.strip())
            list_mode = True
        else:
            # normal paragraph
            doc.add_paragraph(line)
            list_mode = False

    doc.save(docx_path)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python convert_md_to_docx.py input.md output.docx')
        sys.exit(2)
    md_to_docx(sys.argv[1], sys.argv[2])
    print('Converted', sys.argv[1], '->', sys.argv[2])

