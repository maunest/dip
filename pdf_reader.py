import PyPDF2


def text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text

"""
# Пример использования функции:
pdf_file_path = "pdf/1.pdf"  # Укажите путь к вашему PDF-файлу
pdf_text = text_from_pdf(pdf_file_path)
print(pdf_text)
"""